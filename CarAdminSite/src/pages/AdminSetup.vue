<template>
  <div>
    <v-dialog v-model="showForm" max-width="650" >
      <div slot="activator"><v-btn v-if="isSuperAdmin" color="lighten-2" >Create Admin</v-btn></div>
      <v-card>
        <v-card-title class="headline lighten-2" primary-title
          >Create Admin
        </v-card-title>
        <v-card-text>
          <v-form ref="adminForm" v-model="adminForm">
            <v-text-field
              label="Name"
              name="name"
              type="text"
              v-model="newAdmin.name"
              :error="error"
              :rules="[rules.required]"
            />

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                :items="gmail"
                label="Email"
                item-text="gmail"
                item-value="gmail"
                v-model="newAdmin.gmail"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                :items="password"
                label="Password"
                item-text="password"
                item-value="password"
                v-model="newAdmin.password"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="status"
                label="SuperAdmin/Admin"
                item-text="name"
                item-value="status"
                v-model="newAdmin.adminRole"
                :rules="[rules.required]"
              ></v-select>
            </v-col>

            <label for="file">Admin Image</label> <br />
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
          <v-btn color="primary" text @click="saveAdmin">Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      class="table"
      :headers="headers"
      :items="data"
      :rows-per-page-items="[10, 25]"
    >
      <template slot="items" slot-scope="props">
        <td> <v-img
            :src="localDomain +'/admin'+ props.item.imagePath"
            width="80"
            height="80"
            contain
          ></v-img></td>

        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.gmail }}</td>
        <td class="text-xs-left">{{ props.item.adminRole }}</td>
        <td v-if="isSuperAdmin" class="text-xs-left">
          <v-icon class="edit" small @click="edit(props)">edit</v-icon>
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
          Are you sure you want to delete {{ selectDemo.name }} ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warn" @click="deleteAdmin(selectDemo.id)"
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
import utils from "../utils/utils";
import api from "../utils/api.js";
export default {
  data() {
    return {
      localDomain: utils.constant.localDomain,
      showForm: false,

      status: [
        "ADMIN","SUPERADMIN"
        // {
        //   name: "Super Admin",
        //   id: 1
        // },
        // {
        //   name: "Admin",
        //   id: 2
        // }
      ],
      role:[],
      data: [],
      gmail: [],
      password: [],
      phone:[],
      adminForm: false,
      showError:false,
      error:"",
      showResult: false,
      result: "",
      tmpImagePath : "",
      selectDemo: {},
      deleteDialog: false,
      isSuperAdmin : true,
      newAdmin: {
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
      admin: [],
      headers: [
        {
          text: "Photo",
          value: "imagePath",
          align: "left",
          sortable: true
        },
        {
          text: "Name",
          value: "name",
          align: "left",
          sortable: true
        },
        {
          text: "Gmail",
          value: "gmail",
          align: "left",
          sortable: true
        },
        {
          text: "SuperAdmin/Admin",
          value: "adminRole",
          align: "left",
          sortable: true
        },
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
    await this.getAllAdmin();

  },
  methods: {

    async getAllAdmin() {
      const resp = await api.get("admin/get/admins");
      if (resp) {
        const data = await resp.json();
        if (data) this.data = data;

      } else {
        console.log("something wrong");
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

    async saveAdmin() {
      if (this.$refs.adminForm.validate()) {
        let respPosterData = null;
        if (this.imageFile !== "") {
        const respPoster = await utils.http.postMedia(
          "/admin/file/create",
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

        if (this.newAdmin.id == null) {
        if (respPosterData) {
          const resp = await utils.http.post("/admin/create", {
            name: this.newAdmin.name,
            password: this.newAdmin.password,
            gmail: this.newAdmin.gmail,
            adminRole:this.newAdmin.adminRole,
            imagePath: respPosterData,
            // video: this.newAdmin.video
          });
          if(resp.status==200){
              // console.log(resp)
              this.newAdmin={};
              this.showResult=true;
              this.result="Successfully save Admin!"
              this.showForm=false;
              this.getAllAdmin();
              // this.$router.push({ path: "/" });
            }else{
              console.log("error")
            }
        }
        }
        else {
        if (respPosterData) {
          console.log(this.newAdmin.adminRole)
          const respCar = await api.update("admin/admin/update/" +  + this.newAdmin.id, {
            id : this.newAdmin.id,
            name: this.newAdmin.name,
            password: this.newAdmin.password,
            gmail: this.newAdmin.gmail,
            adminRole:this.newAdmin.adminRole,
            imagePath: respPosterData,
          });
          if (respCar.status === 200) {
            this.newAdmin = {};
            this.imageName = "";
            this.imageFile = "";
            this.imageUrl = "";
            this.showForm = false;
            this.getAllAdmin();
          } else {
          }
        }
        }

     } else {
        this.error= "Please check required fields";
        this.showError = true;
      }
     },

    async edit(props) {
      this.showForm = true;
      const resp = await api.get("admin/get/admin/" + props.item.id);
      if (resp) {
        console.log(resp)
        const data = await resp.json();
        if (data) {
          this.newAdmin.id=data.id;
          this.newAdmin.name=data.name;
          this.newAdmin.gmail=data.gmail;
          this.newAdmin.password=data.password;
          this.newAdmin.adminRole=data.adminRole;
          this.newAdmin.imagePath=data.imagePath;
          this.imageUrl = this.localDomain + '/admin' + data.imagePath;
          this.tmpImagePath = data.imagePath;
        }
      }
      else {
        console.log("something wrong")
      }
    },
    async deleteItem(props) {
      this.deleteDialog = true;
      this.selectDemo = props.item;
    },

    async deleteAdmin(id) {
      const resp = await api.remove("admin/delete/" + id);
      if(resp.status==200){
        this.deleteDialog=false;
        await this.getAllAdmin();
      }
    },
  },
  // saveCar() {
  //   const vm = this;
  //   vm.showForm = false;
  // },
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
