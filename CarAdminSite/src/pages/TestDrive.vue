<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="testDrives"
      :items-per-page="7"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.gmail }}</td>
        <td class="text-xs-left">{{ props.item.requestDate }}</td>
        <td class="text-xs-left">{{ props.item.gender }}</td>
        <td class="text-xs-left">{{ props.item.country }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <div v-if="props.item.status==='Approve'">
          <td class="text-xs-left" style="color:green; padding-top: 13px;">{{ props.item.status }}</td>
        </div>
        <div v-else-if="props.item.status==='Reject'">
          <td class="text-xs-left" style="color:red; padding-top:13px;">{{ props.item.status }}</td>
        </div>
        <div v-else>
          <td class="text-xs-left" style="color:darkgoldenrod; padding-top:13px;">{{ props.item.status }}</td>
        </div>

        <td class="text-xs-left">
          <v-icon class="approve" small @click="approveRequest(props)"
            >check</v-icon
          >
          <v-icon class="reject" small @click="rejectRequest(props)"
            >cancel</v-icon
          >
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="rejectDialog" width="450">
      <v-card>
        <v-card-title class="headline lighten-2"> Reject</v-card-title>
        <v-card-text>
          <v-textarea label="Message" name="msg" v-model="message" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            style="margin-bottom: 10px;margin-right: 10px;"
            color="primary"
            @click="reject(rejectData.id)"
            >Send Email</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="approveDialog" width="450">
      <v-card>
        <v-card-title class="headline lighten-2"> Approve</v-card-title>
        <v-card-text>
          <v-card-text>
            <v-textarea label="Message" name="msg1" v-model="message" />
          </v-card-text>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            style="margin-bottom: 10px;margin-right: 10px;"
            color="primary"
            @click="approve(approveData.id)"
            >Send Email</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="green" v-model="showResult" :timeout="2000" top>
      {{ result }}
    </v-snackbar>
  </div>
</template>
<script>
import api from "../utils/api.js";
export default {
  mounted() {
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute("src", "https://smtpjs.com/v3/smtp.js");
    document.head.appendChild(recaptchaScript);
  },
  data() {
    return {
      showResult:false,
      result:"Send Email Successful",
      accept:"Approve",
      approveData:[],
      rejectData:[],
      rejectText:"Reject",
      testDrives: [],
      rejectDialog: false,
      approveDialog: false,
      selectedId: "",
      selected : {},
      message: "",
      selectedEmail: "",
      headers: [
        {
          text: " Name",
          value: "Name",
          align: "left",
          sortable: false
        },
        {
          text: "Gmail",
          value: "Gamil",
          align: "left",
          sortable: false
        },
        {
          text: "Request Date",
          value: "Date",
          align: "left",
          sortable: false
        },
        {
          text: "Gender",
          value: "Gender",
          align: "left",
          sortable: false
        },
        {
          text: "Country",
          value: "Country",
          align: "left",
          sortable: false
        },
        {
          text: "Phone",
          value: "Phone",
          align: "left",
          sortable: false
        },
        {
          text: "Status",
          value: "status",
          align: "left",
          sortable: false
        },

        { text: "Actions", value: "actions" }
      ]
    };
  },
  async created() {
    await this.getAllTestDrive();
  },
  methods: {
    async getAllTestDrive() {
      const resp = await api.get("testDrive/get/testDrives");
      if (resp) {
        const data = await resp.json();
        // console.log(data)
        if (data) this.testDrives = data;
      } else {
        console.log("something wrong");
      }
    },

    async rejectRequest(props) {
      const resp=await api.get("testDrive/get/testDrive/" + props.item.id);
      if(resp.status==200){
        const data =await resp.json();
        this.rejectData=data;
        // console.log(data)
      }
      this.rejectDialog = true;
      this.selected = props.item;
      this.selectedId = props.item.id;
      this.selectedEmail = props.item.gmail;
    },

    async approveRequest(props) {
      // console.log(props.item.id)
      const resp=await api.get("testDrive/get/testDrive/" + props.item.id);
      if(resp.status==200){
        const data = await resp.json();
        this.approveData=data;
          // console.log(this.datas.id)
      }
      this.approveDialog = true;
      this.selectedId = props.item.id;
      this.selectedEmail = props.item.gmail;
    },

   async reject(id) {
      // tmp = this.message;
      const resp=await api.update("testDrive/update/" +id,{
        id:this.rejectData.id,
        name:this.rejectData.name,
        gmail:this.rejectData.gmail,
        gender:this.rejectData.gender,
        country:this.rejectData.country,
        phone:this.rejectData.phone,
        requestDate:this.rejectData.requestDate,
        carId:this.rejectData.carId,
        status:this.rejectText,
      });
      if(resp.status==200){
        console.log(resp)
      }
      let tmp = "<p>Hey " + this.selected.name + "</p>";
      tmp = tmp + "<p>" + this.message + "</p>" +
          "<p>Car Guru Team</p>";
      Email.send({
        SecureToken: "79888d3d-3cbf-44ca-a4dd-8bb6076f3c01",
        To: this.selectedEmail,
        From: "khantminthu199666@gmail.com",
        Subject: "Test Drive Request Notification",
        Body: tmp
      }).then(message => this.showResult=true);
      this.getAllTestDrive();
      this.rejectDialog = false;
    },

   async approve(id) {
      const resp=await api.update("testDrive/update/" + id,{
          id:this.approveData.id,
          name:this.approveData.name,
          gmail:this.approveData.gmail,
          gender:this.approveData.gender,
          country:this.approveData.country,
          phone:this.approveData.phone,
          requestDate:this.approveData.requestDate,
          carId:this.approveData.carId,
          status:this.accept,
      });

      if(resp.status==200){
        const data = await resp.json();
        // console.log(data);
        Email.send({
        SecureToken: "79888d3d-3cbf-44ca-a4dd-8bb6076f3c01",
        To: this.selectedEmail,
        From: "khantminthu199666@gmail.com",
        Subject: "Test Drive Request Notification",
        Body:  this.message
      }).then(message => this.showResult=true);
      // this.approve="accept"
      this.getAllTestDrive();
      this.approveDialog = false;
    }
  }
      }
};
</script>
<style>
.approve {
  color: #16da6e !important;
  font-size: 20px !important;
}

.reject {
  margin-left: 10px;
  color: #f44336 !important;
  font-size: 20px !important;
}
</style>
