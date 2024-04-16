<template>
  <div>
    <v-dialog v-model="dialog" width="500px">
      <div slot="activator"><v-btn class="lighten-2">Create Brand</v-btn></div>
      <v-card>
        <v-card-title class="headline lighten-2" primary-title
          >Create Brand
        </v-card-title>
        <v-card-text>
          <v-form ref="brandFrom" v-model="brandFrom">
            <v-text-field name="brandName" label="Brand Name" type="text" v-model="newList.brandName" :error="error"
              :rules="[rules.required]" />

              <v-col cols="12" sm="6" md="4">
              <v-select
                :items="countries"
                label="Produce Country"
                item-text="name"
                item-value="id"
                v-model="newList.produceCountry"
                :rules="[rules.required]"
                :error="error"
              ></v-select>
            </v-col>

          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table :headers="headers" :items="brands" :items-per-page="7" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.brandName }}</td>
        <td class="text-xs-left">{{ props.item.produceCountry }}</td>
        <td v-if="isSuperAdmin" class="text-xs-left">
          <v-icon  class="edit" small @click="editBrand(props)">edit</v-icon>
          <v-icon class="delete" small @click="deleteItem(props)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteDialog" width="450">
      <v-card>
        <v-card-title class="headline lighten-2"> Delete Confirm</v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ selectDemo.brandName}} ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warn" @click="deleteBrand(selectDemo.id)"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline lighten-2" primary-title>
          Edit Brand
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="brand.brandName" label="Brand name"></v-text-field>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="countries"
                label="Produce Country"
                item-text="name"
                item-value="id"
                v-model="brand.produceCountry"
                :rules="[rules.required]"
                :error="error"
              ></v-select>
            </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editSave(brand.id)">
            editSave
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="red" v-model="showError" :timeout="2000" top>
      {{ error }}
    </v-snackbar>
    <v-snackbar color="green" v-model="showResult" :timeout="2000" top>
      {{ result }}
    </v-snackbar>
  </div>
</template>

<script>
import api from '../utils/api.js'
export default {
  data() {
    return {
      showResult:false,
      result:"",
      showError:false,
      error:"",
      countries: [
        {
          name: "Japan",
          id: "Japan"
        },
        {
          name: "American",
          id: "American"
        },
        {
          name: "Germany",
          id: "Germany"
        },
        {
          name: "United Kingdom",
          id: "UK"
        },
      ],
      brandFrom:false,
      editDialog: false,
      deleteDialog: false,
      isSuperAdmin : true,
      selectDemo: {},
      brands: [],
      brand: [],
      newList: {
        brandName: "",
        produceCountry: "",
      },
      dialog: false,
      rules: {
        required: value => !!value || "Required."
      },
      error: false,
      headers: [
        {
          text: "Brand Name",
          value: "brandName",
          align: "left",
          sortable: false
        },
        {
          text: "Produce Country",
          value: "produceCountry",
          align: "left",
          sortable: false
        },
        { text: 'Actions', value: 'actions' },
      ]
    };
  },
  async created() {
    const level = JSON.parse(localStorage.getItem("adminLevel"));
    if (level.adminRole == 'ADMIN') {
      this.isSuperAdmin = false;
    } else {
      this.isSuperAdmin = true;
    }
    await this.getAllBrands();
  },
  methods: {
    deleteItem(props) {
      this.deleteDialog = true;
      this.selectDemo = props.item;
    },
    async deleteBrand(id) {
      const resp = await api.remove("brand/delete/" + id);
      if (resp.status == 200) {
        this.deleteDialog = false;
        console.log('delete is working')
        await this.getAllBrands();
      }
      else {
        console.log("sth wrong in delete id");
      }
    },
    async getAllBrands() {
      const resp = await api.get("brand/get/brands");
      if (resp) {
        const data = await resp.json();
        if (data) this.brands = data;
      }
      else {
        console.log("something wrong")
      }
    },
    async save() {
      if(this.$refs.brandFrom.validate()){
        const resp = await api.save("brand/create",
        {
          brandName: this.newList.brandName,
          produceCountry: this.newList.produceCountry,
        });
      if (resp) {
        this.result="Successfully Save Brand!";
        this.showResult=true;
        this.newList = {};
        this.getAllBrands();
        this.dialog = false;
      }
      }else{
        this.error = "Please check required fields";
        this.showError = true;
      }
    },
    async editBrand(props) {
      this.editDialog = true;
      const resp = await api.get("brand/get/brand/" + props.item.id);
      if (resp) {
        const data = await resp.json();
        if (data) this.brand = data;
      }
      else {
        console.log("something wrong")
      }
    },
    async editSave(id) {
      const resp = await api.update("brand/update/" + id, {
        id: this.brand.id,
        brandName: this.brand.brandName,
        produceCountry: this.brand.produceCountry,
      });
      if (resp) {
        this.getAllBrands();
        this.editDialog = false;
      }
    },
  }
}
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
