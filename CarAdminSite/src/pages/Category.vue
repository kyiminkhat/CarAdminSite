<template>
  <div>
    <v-dialog v-model="dialog" width="650">
      <div slot="activator"><v-btn class="lighten-2">Create Category</v-btn></div>

        <v-card>
        <v-card-title class="headline lighten-2" primary-title>
          Create Category
        </v-card-title>
        <v-form ref="categoryForm" v-model="categoryForm">
          <v-card-text>
            <v-text-field name="categoryName" label="Category Name" type="text" v-model="category.categoryName" :error="error"
              :rules="[rules.required]" />
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="save">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>

    </v-dialog>
    <v-data-table :headers="headers" :items="categorys" :items-per-page="7" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.categoryName }}</td>
        <td v-if="isSuperAdmin" class="text-xs-left">
          <v-icon class="edit" small @click="editCategory(props)">edit</v-icon>
          <v-icon class="delete" small @click="deleteItem(props)">delete</v-icon>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="deleteDialog" width="450">
      <v-card>
        <v-card-title class="headline lighten-2"> Delete Confirm</v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ selectDemo.categoryName}} ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warn" @click="deleteCategory(selectDemo.id)"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
       <v-card-title class="headline lighten-2" primary-title>
          Edit Category
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="category.categoryName" label="Cateory name"></v-text-field>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editSave(category.id)">
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
      showError:false,
      error:"",
      result:"",
      categoryForm:false,
      editDialog: false,
      isSuperAdmin : true,
      deleteDialog: false,
      selectDemo: {},
      categorys: [],
      category: [],
      category: {
        categoryName: ""
      },
      result: "",

      dialog: false,
      showResult: false,
      rules: {
        required: value => !!value || "Required."
      },
      error: false,
      users: [],
      headers: [
        {
          text: "Brand Name",
          value: "brandName",
          align: "left",
          sortable: true,
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
    await this.getAllCategorys();
  },
  methods: {
    deleteItem(props) {
      this.deleteDialog = true;
      this.selectDemo = props.item;
    },
    async deleteCategory(id) {
      const resp = await api.remove("category/delete/" + id);
      if (resp.status == 200) {
        this.deleteDialog = false;
        console.log('delete is working')
        await this.getAllCategorys();
      }
      else {
        console.log("sth wrong in delete id");
      }
    },
    async save() {
      if(this.$refs.categoryForm.validate()){
        const resp = await api.save("category/create",
        {
          categoryName: this.category.categoryName,
        });
      if (resp) {
        this.showResult=true;
        this.result="Successfully save Category!";
        this.category = {};
        this.getAllCategorys();
        this.dialog = false;
      }
      }else{
        this.showError=true;
        this.error="Please check required fields";
      }
    },
    randomAvatar() {
      return avatars[Math.floor(Math.random() * avatars.length)];
    },

    async getAllCategorys() {
      const resp = await api.get("category/get/categorys");
      if (resp) {
        const data = await resp.json();
        if (data) this.categorys = data;
      }
      else {
        console.log("something wrong")
      }
    },
    async editCategory(props) {
      this.editDialog = true;
      const resp = await api.get("category/get/category/" + props.item.id);
      if (resp) {
        const data = await resp.json();
        if (data) this.category = data;
      }
      else {
        console.log("something wrong")
      }
    },
    async editSave(id) {
      const resp = await api.update("category/update/" + id, {
        id: this.category.id,
        categoryName: this.category.categoryName,

      });
      if (resp) {
        this.getAllCategorys();
        this.editDialog = false;
      }
    },
  },
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
