<template>
  <div>
    <v-dialog v-model="dialog" width="650">
      <div slot="activator"><v-btn class="lighten-2">Create Discount</v-btn></div>
      <v-card>
        <v-card-title class="headline lighten-2" primary-title>
          Create Discount
        </v-card-title>

        <v-card-text>
          <v-form ref="discountForm" v-model="discountForm">
            <v-text-field
              name="Discount Name"
              label="Discount Name"
              type="text"
              v-model="discount.discountName"
              :error="error"
              :rules="[rules.required]"
            />

            <v-text-field
              name="Percentage"
              label="Percentage"
              type="number"
              v-model="discount.percentage"
              :error="error"
              :rules="[rules.required]"
            ></v-text-field>

            <!-- <v-text-field
              name="FromDate"
              label="From Date"
              type="date"
              v-model="discount.fromDate"
              :error="error"
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              name="ToDate"
              label="To Date"
              type="date"
              v-model="discount.toDate"
              :error="error"
              :rules="[rules.required]"
            ></v-text-field> -->
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-btn color="primary" @click="login">Create Discount</v-btn> -->
    <v-data-table
      class="table"
      :headers="headers"
      :items="discountData"
      :rows-per-page-items="[10, 25]"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.discountName }}</td>
        <td class="text-xs-left">{{ props.item.percentage }}</td>
        <!-- <td class="text-xs-left">{{ props.item.fromDate }}</td>
        <td class="text-xs-left">{{ props.item.toDate }}</td> -->
        <td v-if="isSuperAdmin" class="text-xs-left">
          <v-icon class="edit" small @click="editDiscount(props)">edit</v-icon>
          <v-icon class="delete" small @click="deleteItem(props)"
            >delete</v-icon
          >
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteDialog" width="450">
      <v-card>
        <v-card-title class="headline lighten-2"> Delete Confirm</v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ selectDemo.discountName }} ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warn" @click="deleteDiscount(selectDemo.id)"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="red" v-model="showError" :timeout="2000" top>
      {{ error }}
    </v-snackbar>
    <v-snackbar color="success" v-model="showResult" :timeout="2000" top>
      {{ result }}
    </v-snackbar>
  </div>
</template>

<script>
import api from "../utils/api.js";
export default {
  data() {
    return {
      discount: {
        id: null,
        discountName: "",
        percentage: "",
        fromDate: "2022-12-22",
        toDate: "2022-12-30"
      },
      loading: false,
      dialog: false,
      hidePassword: true,
      error: false,
      showResult: false,
      showError:false,
      isSuperAdmin : true,
      error:"",
      deleteDialog: false,
      result: "",
      rules: {
        required: value => !!value || "Required."
      },
      discountData: [],
      discountForm: false,
      selectDemo: {},
      headers: [
        {
          text: "DiscountName",
          value: "discountName",
          align: "left",
          sortable: true
        },
        {
          text: "Percentage",
          value: "percentage",
          align: "left",
          sortable: true
        },
        // {
        //   text: "FromDate",
        //   value: "fromDate",
        //   align: "left",
        //   sortable: true
        // },
        // {
        //   text: "ToDate",
        //   value: "toDate",
        //   align: "left",
        //   sortable: true
        // },
        { text: "Actions", value: "actions" }
      ]
    };
  },

  methods: {
    async getAllDiscount() {
      const resp = await api.get("discount/discountList");
      if (resp) {
        const data = await resp.json();
        if (data) this.discountData = data;
      } else {
        console.log("something wrong");
      }
    },

    async save() {
      if (this.$refs.discountForm.validate()) {
        if (this.discount.id == null) {
          const resp = await api.save("discount/create", {
            discountName: this.discount.discountName,
            percentage: this.discount.percentage,
            fromDate: this.discount.fromDate,
            toDate: this.discount.toDate
          });
          if (resp) {
            this.showResult=true;
            this.result="Successfully save Discount!"
            this.discount = {};
            this.getAllDiscount();
            this.dialog = false;
          }
        } else {
          const resp = await api.update("discount/update/" + this.discount.id, {
            id : this.discount.id,
            discountName: this.discount.discountName,
            percentage: this.discount.percentage,
            fromDate: this.discount.fromDate,
            toDate: this.discount.toDate
          });
          if (resp) {
            this.discount = {};
            this.getAllDiscount();
            this.dialog = false;
          }
        }
      } else {
        this.error = "Please check required fields";
        this.showError = true;
        return;
      }
    },

    async editDiscount(props) {
      const resp = await api.get("discount/" + props.item.id);
      if (resp) {
        const data = await resp.json();
        if (data) {
          this.discount.id = data.id;
          this.discount.discountName = data.discountName;
          this.discount.percentage = data.percentage;
          this.discount.fromDate = data.fromDate;
          this.discount.toDate = data.toDate;
          this.dialog = true;
        }
      }
    },

    deleteItem(props) {
      this.deleteDialog = true;
      this.selectDemo = props.item;
    },

    async deleteDiscount(id) {
      const resp = await api.remove("discount/delete/" + id);
      if (resp.status == 200) {
        this.deleteDialog = false;
        await this.getAllDiscount();
      }
    }
  },

  async created() {
    const level = JSON.parse(localStorage.getItem("adminLevel"));
    if (level.adminRole == 'ADMIN') {
      this.isSuperAdmin = false;
    } else {
      this.isSuperAdmin = true;
    }
    await this.getAllDiscount();
  }
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
</style>
