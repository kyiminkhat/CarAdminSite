<template>
  <div>
    <vue-excel-xlsx
    class="excel"
    color="secondary"
      :data="orders"
      :columns="columns"
      :file-name="'DailySellReport'"
      :file-type="'xlsx'"
      :sheet-name="'sheet'"
    >
      EXCEL EXPORT
    </vue-excel-xlsx>

    <v-data-table
      class="table"
      :headers="headers"
      :items="orders"
      :rows-per-page-items="[10, 25]"
    >
      <template slot="items" slot-scope="props">
        <!-- <td> <v-img
            :src="localDomain +'/user'+ props.item.userImage"
            width="80"
            height="80"
            contain
          ></v-img></td> -->
        <td class="text-xs-left" >{{ props.item.userName}}</td>
        <!-- <td class="text-xs-left">{{ props.item.userImage}}</td> -->
        <td class="text-xs-left">{{ props.item.userGmail }}</td>
        <td class="text-xs-left">{{ props.item.name}}</td>
        <!-- <td class="text-xs-left">{{ props.item.image_path}}</td> -->
        <!-- <td> <v-img
            :src="localDomain +'/car'+ props.item.image_path"
            width="80"
            height="80"
            contain
          ></v-img></td> -->
        <td class="text-xs-left">{{ props.item.car_quantity}}</td>
        <td class="text-xs-left">{{ props.item.total}}</td>
        <td class="text-xs-left">{{ props.item.created_at}}</td>
      </template>

    </v-data-table>
  </div>
</template>

<script>
import VueExcelXlsx from "vue-excel-xlsx";
import Vue from "vue";
import api from '../utils/api.js'
import utils from "../utils/utils";
Vue.use(VueExcelXlsx);

export default {
  data() {
    return {
      // userId:"aunghtet",
      localDomain: utils.constant.localDomain,
      orders:[],
      users:[],

        columns : [
                    // {
                    //     label: "User Image",
                    //     field: "userImage",
                    // },
                    {
                        label: "User Name",
                        field: "userName",
                    },
                    {
                        label: "Gmail",
                        field: "userGmail",
                        // dataFormat: this.priceFormat
                    },
                    {
                        label: "Car Name",
                        field: "name",
                    },
                    // {
                    //     label: "Car Image",
                    //     field: "image_path",
                    // },
                    {
                        label: "Quantity",
                        field: "car_quantity",
                    },
                    {
                        label: "Total",
                        field: "total",
                    },
                    {
                        label: "Created At",
                        field: "created_at",
                    },
                ],


      users: [],
      headers: [
        // {
        //   text: "User Image",
        //   value: "Car Name",
        //   align: "left",
        //   sortable: true
        // },
        {
          text: "User Name",
          value: "Car Image",
          align: "left",
          sortable: true
        },
        {
          text: "Gamil",
          value: "Car Name",
          align: "left",
          sortable: true
        },
        {
          text: "Car Name",
          value: "Username",
          align: "left",
          sortable: true
        },
        // {
        //   text: "Car Image",
        //   value: "Email",
        //   align: "left",
        //   sortable: true
        // },
        {
          text: "Quantity",
          value: "Phone",
          align: "left",
          sortable: true
        },
        {
          text: "Total",
          value: "Date",
          align: "left",
          sortable: true
        },
        {
          text: "Date",
          value: "Website",
          align: "left",
          sortable: true
        }
      ]
    };
  },
  async created() {
    await this.getOrders();
    // await this.getUser();
  },

  methods: {
    async getOrders() {
      const resp = await api.get("order/get/orders");
      if (resp) {

        // alert("orders")
        const data = await resp.json();
        console.log(data)
        if (data) this.orders = data;
      }
      else {
        console.log("something wrong")
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
</style>
