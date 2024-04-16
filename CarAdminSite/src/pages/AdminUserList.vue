<template>
    <div>
      <vue-excel-xlsx
    class="excel"
    color="secondary"
      :data="users"
      :columns="columns"
      :file-name="'DailySellReport'"
      :file-type="'xlsx'"
      :sheet-name="'sheet'"
    >
      EXCEL EXPORT
    </vue-excel-xlsx>
    <v-dialog v-model="showForm" max-width="650" >
      <v-card>
        <v-card-title class="headline lighten-2" primary-title
          >Edit User
        </v-card-title>
        <v-card-text>
          <v-form ref="userForm" v-model="userForm">
            <v-text-field
              label="Name"
              name="name"
              type="text"
              v-model="newUser.name"
              :error="error"
              :rules="[rules.required]"
            />

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                :items="gmail"
                label="Email"
                item-text="gmail"
                item-value="gmail"
                v-model="newUser.gmail"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                :items="phone"
                label="Phone"
                item-text="phone"
                item-value="phone"
                v-model="newUser.phone"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <label for="file">User Image</label> <br />
            <input
              type="file"
              ref="image"
              accept="image/*"
              @change="onFilePicked"
            />

            <v-img
              class="img"
              v-if="imageUrl != ''"
              :src="imageUrl"
              width="200"
              height="150"
              contain
            >
            </v-img>

          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveUser">Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <v-data-table
        class="table"
        :headers="headers"
        :items="users"
        :rows-per-page-items="[10, 25]"
      >
      <template slot="items" slot-scope="props">
        <td> <v-img
            :src="localDomain +'/user'+ props.item.imagePath"
            width="80"
            height="80"
            contain
          ></v-img></td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <!-- <td class="text-xs-left">{{ props.item.password }}</td> -->
        <td class="text-xs-left">{{ props.item.gmail }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <!-- <td class="text-xs-left">{{ props.item.createdAt }}</td> -->
        <!-- <td class="text-xs-left">
          <v-icon class="edit" small @click="edit(props)">edit</v-icon>
          <v-icon class="delete" small @click="deleteItem(props)"
            >delete</v-icon
          >
        </td> -->

        </template>
      </v-data-table>
      <v-dialog v-model="deleteDialog" width="450">
      <v-card>
        <v-card-title class="headline lighten-2"> Delete Confirm</v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ selectDemo.name }} ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warn" @click="deleteUser(selectDemo.id)"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
  </template>

  <script>
  import VueExcelXlsx from "vue-excel-xlsx";
  import Vue from "vue";
  import api from "../utils/api"
  import utils from "../utils/utils";
  Vue.use(VueExcelXlsx);

  export default {
    data() {
      return {
        localDomain: utils.constant.localDomain,
        showForm: false,
        userForm:false,
      data: [],
      gmail: [],
      password: [],
      phone:[],
      adminForm: false,
      showResult: false,
      result: "",
      tmpImagePath : "",
      selectDemo: {},
      deleteDialog: false,
      newUser: {
        // id: null,
        name: "",
        gmail: "",
        password: "",
        phone:"",
        adminRole:"",
        imagePath: "",

      },
      rules: {
        required: value => !!value || "Required."
      },
      imageName: "",
      imageUrl: "",
      imageFile: "",
      error: false,
          columns : [

                      {
                          label: " Name",
                          field: "name",

                      },
                      // {
                      //     label: "Password",
                      //     field: "password",

                      // },
                      {
                          label: "Gmail",
                          field: "gmail",
                      },
                      {
                          label: "Phone",
                          field: "phone",
                      },
                      // {
                      //     label: "Created At",
                      //     field: "createdAt",
                      // },
                      // {
                      //     label: "Photo",
                      //     field: "imagePath",
                      // },
                  ],


        users: [],
        headers: [

          {
            text: "Photo",
            value: "imagePath",
            align: "left",
            sortable: true
          },
          {
            text: " Name",
            value: "name",
            align: "left",
            sortable: true
          },
          // {
          //   text: "Password",
          //   value: "password",
          //   align: "left",
          //   sortable: true
          // },
          {
            text: "Gmail",
            value: "gmail",
            align: "left",
            sortable: true
          },

          {
            text: "Phone",
            value: "Phone",
            align: "left",
            sortable: true
          },
          // {
          //   text: "Created At",
          //   value: "createdAt",
          //   align: "left",
          //   sortable: true
          // },
        ]
      };
    },
    async created() {
    await this.getAllUser();
  },
    methods: {
    async getAllUser(){
      const resp=await  api.get("user/get/users");
      if(resp){
        const data=await resp.json();
        if(data) this.users=data;
      }
      else{
        console.log("something wrong ");
      }
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
          console.log(this.imageUrl), console.log(this.imageFile);
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    async edit(props) {
      this.showForm = true;
      const resp = await api.get("user/get/user/" + props.item.id);
      if (resp) {
        console.log(resp)
        const data = await resp.json();
        if (data) {
          this.newUser.id=data.id;
          this.newUser.name=data.name;
          this.newUser.gmail=data.gmail;
          this.newUser.password=data.password;
          this.newUser.phone=data.phone;
          this.newUser.imagePath=data.imagePath;
          this.imageUrl = this.localDomain + '/user' + data.imagePath;
          this.tmpImagePath = data.imagePath;
        }
      }
      else {
        console.log("something wrong")
      }
    },

    async saveUser() {
      if (this.$refs.userForm.validate()) {
        let respPosterData = null;
        if (this.imageFile !== "") {
        const respPoster = await utils.http.postMedia(
          "/user/file/create",
          this.imageFile,
          this.imageFile.type
        );
        console.log("working")
        if (respPoster.status === 200) {
          respPosterData = await respPoster.text();
          console.log(respPosterData);

        } else {

        }

        } else {
          respPosterData = this.tmpImagePath;
        }

        if (this.newUser.id == null) {
        if (respPosterData) {
          const resp = await utils.http.post("/user/create", {
            name: this.new.name,
            password: this.newAdmin.password,
            gmail: this.newAdmin.gmail,
            imagePath: respPosterData,
            // video: this.newAdmin.video
          });
          if(resp.status==200){
              console.log(resp)
              this.adminForm=false;
              this.$router.push({ path: "/" });
            }else{
              console.log("error")
            }
        }
        }
        else {
        if (respPosterData) {
          console.log("workding")
          const resp = await api.update("user/user/update/" +  + this.newUser.id, {
            id : this.newUser.id,
            name: this.newUser.name,
            password: this.newUser.password,
            gmail: this.newUser.gmail,
            phone:this.newUser.phone,
            imagePath: respPosterData,
          });
          console.log(resp)
          if (resp.status === 200) {
            this.newUser = {};
            this.imageName = "";
            this.imageFile = "";
            this.imageUrl = "";
            this.showForm = false;
            this.getAllUser();
          } else {
          }
        }
        }

      } else {
        this.result = "Please check required fields";
        this.showResult = true;
      }
    },
    async deleteItem(props) {
      this.deleteDialog = true;
      this.selectDemo = props.item;
    },

    async deleteUser(id) {
      const resp = await api.remove("user/delete/" + id);
      if(resp.status==200){
        this.deleteDialog=false;
        await this.getAllUser();
      }
    },
    },


  };
  </script>

  <style>
  .table {
    border-radius: 3px;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.125);
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.21);
    background-color: transparent;
  }
  .excel {
  border-radius: 28px;
    background-color: #00a602 ;
    align-items: center;
    height: 36px;
    font-size: 14px;
    font-weight: 500;
    justify-content: center;
    margin: 6px 8px;
    min-width: 13%;
}
.img {
  border-radius: 5%;
  margin-left: 0px;
  width: 400px;
  height: 260px;
}
.img {
  margin-left: 0px;
}

.lighten-2 {
  border-radius: 28px;
  background-color: #f25417 !important;
}

.edit {
  color: #ff9800 !important;
  font-size: 20px !important;
}

.delete {
  color: #f44336 !important;
  font-size: 20px !important;
}
.img {
  border-radius: 5%;
  margin-left: 0px;
  width: 100px;
  height: 100px;
}
  </style>
