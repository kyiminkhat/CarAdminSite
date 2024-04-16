<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <!-- Widgets-->
      <v-flex d-flex lg4 sm6 xs12>
        <widget icon="money_off" :title=result :supTitle="$t('widgetTodaysTotalAmount')" color="#dc3545"/>
      </v-flex>
      <v-flex d-flex lg4 sm6 xs12>
        <widget icon="domain" :title= toDayRegistrationCount :supTitle="$t('widgetTodaysRegistraion')" color="#00b297"/>
      </v-flex>
      <v-flex d-flex lg4 sm6 xs12>
        <widget icon="computer" :title= toDayOrderCount  :supTitle="$t('widgetTodaysOrder')" color="#0866C6"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import utils from "../utils/utils";
import api from "../utils/api.js";
export default {
  data() {
    return {
      total:[],
      result:null,
      toDayRegistrationCount : 0,
      toDayOrderCount : 0,
      todayDate : '',
      from : '',
      to: '',
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando.`
    }
  },
  async created() {
    const current = new Date();
    const date = current.getDate();
    const month = + current.getMonth()+ 1;
    const year = + current.getFullYear();
    this.todayDate = year+ '-' + month + '-' + date
    // console.log(this.todayDate)
    // this.from = todayDate + ' ' + '00:00:00';
    // this.to = todayDate + ' ' + '23:59:59';
    await this.getToDayRegistration();
    await this.getToDayOrder();
    await this.getToDaySellingAmount();
  },

  methods: {
    async getToDayRegistration() {
      const resp = await utils.http.get("/user/getToDayRegistration/" + this.todayDate );
      if (resp) {
        const data = await resp.json();
        this.toDayRegistrationCount = data.length;
        // console.log(this.toDayRegistrationCount)
      } else {
        console.log("something wrong");
      }
    },

    async getToDayOrder(){
      const resp=await utils.http.get("/order/getToDayOrder/" + this.todayDate);
      if(resp){
        const data=await resp.json();
        // console.log(data)
        this.toDayOrderCount=data.length;
      }else{
        console.log("something wrong")
      }
    },

    async getToDaySellingAmount(){
      const resp=await utils.http.get("/order/getToDaySellingAmount/" + this.todayDate);
      if(resp){
        // console.log(resp)
        const data = await resp.json();
        // this.total=data;
        // console.log(this.total);
        let z=0;
        data.forEach(x => {
            z+=x.total
        });
        this.result=z;
        // console.log(z);
      }
    }

  }
}
</script>

<style>

</style>
