<template>
  <div>
    <v-dialog v-model="showForm" max-width="650">
      <div slot="activator"><v-btn class="lighten-2" >Create Car</v-btn></div>
      <v-card>
        <v-card-title class="headline lighten-2" primary-title
          >Create Car
        </v-card-title>
        <v-card-text>
          <v-form ref="carForm" v-model="carForm">
            <v-text-field
              label="Name"
              name="carname"
              type="text"
              v-model="newCar.name"
              :error="error"
              :rules="[rules.required]"
            />

            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="brandList"
                label="Brand"
                item-text="brandName"
                item-value="id"
                v-model="newCar.brandId"
                :rules="[rules.required]"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="categoryList"
                label="Category"
                item-text="categoryName"
                item-value="id"
                v-model="newCar.categoryId"
                :rules="[rules.required]"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="discountData"
                label="Discount"
                item-text="discountName"
                item-value="id"
                v-model="newCar.discountId"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="status"
                label="Used_Car/Brand_Car"
                item-text="name"
                item-value="id"
                v-model="newCar.status"
                :rules="[rules.required]"
              ></v-select>
            </v-col>

            <v-text-field
              label="Quantity"
              name="quantity"
              type="number"
              v-model="newCar.quantity"
              :error="error"
              :rules="[rules.required]"
            />
            <v-text-field
              label="Price"
              name="price"
              type="number"
              v-model="newCar.price"
              :error="error"
              :rules="[rules.required]"
              suffix="$"
            />
            <v-text-field
              label="Waiting Time"
              name="waitingTime"
              type="number"
              v-model="newCar.waitingTime"
              :error="error"
              :rules="[rules.required]"
              suffix="Week"
            />

            <v-checkbox
              v-model="newCar.isPublic"
              :label="'IsPublic'"
            ></v-checkbox>

            <v-checkbox
              v-model="newCar.availableTestDrive"
              :label="'AvailableTestDrive'"
            ></v-checkbox>

            <label for="file">Car Image</label> <br/>
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

            <v-text-field
              label=" Video"
              name="video"
              type="text"
              v-model="newCar.video"
            />

            <v-textarea
              label="Description"
              name="description"
              v-model="newCar.description"
              :error="error"
              :rules="[rules.required]"
            />
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveCar">Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      class="table"
      :headers="headers"
      :items="cars"
      :rows-per-page-items="[10, 25]"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left" v-if="props.item.status == 1">Brand New</td>
        <td class="text-xs-left" v-if="props.item.status == 2">Used</td>
        <td class="text-xs-left">{{ props.item.quantity }}</td>
        <td class="text-xs-left">{{ props.item.waitingTime }}</td>
        <td class="text-xs-left">{{ props.item.isPublic }}</td>
        <td class="text-xs-left">{{ props.item.availableTestDrive }}</td>
        <td v-if="isSuperAdmin" class="text-xs-left">
          <v-icon class="edit" small @click="edit(props)">edit</v-icon>
          <v-icon class="delete" small @click="deleteItem(props)"
            >delete</v-icon
          >
        </td>
        <!-- <td class="text-xs-left">{{ props.item.address.city }}</td> -->
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
          <v-btn color="warn" @click="deleteCar(selectDemo.id)"
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
        {
          name: "Brand New",
          id: 1
        },
        {
          name: "Used",
          id: 2
        }
      ],

      brandList: [],
      categoryList: [],
      discountData: [],
      carForm: false,
      showError:false,
      error:"",
      showResult: false,
      result: "",
      tmpImagePath : "",
      selectDemo: {},
      deleteDialog: false,
      newCar: {
        id: null,
        name: "",
        brandId: null,
        categoryId: null,
        discountId: null,
        description: "",
        isPublic: false,
        isSuperAdmin : true,
        availableTestDrive:false,
        price: null,
        waitingTime: null,
        quantity: null,
        status: null,
        imagePath: "",
        video: ""
      },
      rules: {
        required: value => !!value || "Required."
      },
      imageName: "",
      imageUrl: "",
      imageFile: "",
      error: false,
      cars: [],
      headers: [
        {
          text: "Name",
          value: "name",
          align: "left",
          sortable: true
        },
        {
          text: "BrandCar/UsedCar",
          value: "carType",
          align: "left",
          sortable: true
        },
        {
          text: "Quantity",
          value: "quantity",
          align: "left",
          sortable: true
        },
        {
          text: "Waiting Time",
          value: "waitingTime",
          align: "left",
          sortable: true
        },
        {
          text: "IsPublic",
          value: "isPublic",
          align: "left",
          sortable: true
        },
        {
          text: "AvailableTestDrive",
          value: "availableTestDrive",
          align: "left",
          sortable: true
        },
        { text: "Actions", value: "actions" },
      ]
    };
  },

  methods: {
    async getAllBrands() {
      const resp = await api.get("brand/get/brands");
      if (resp) {
        const data = await resp.json();
        if (data) this.brandList = data;
      } else {
        console.log("something wrong");
      }
    },

    async getAllCategorys() {
      const resp = await api.get("category/get/categorys");
      if (resp) {
        const data = await resp.json();
        if (data) this.categoryList = data;
      } else {
        console.log("something wrong");
      }
    },

    async getAllDiscount() {
      const resp = await api.get("discount/discountList");
      if (resp) {
        const data = await resp.json();
        if (data) this.discountData = data;
      } else {
        console.log("something wrong");
      }
    },

    async getAllCar() {
      const resp = await api.get("car/carList");
      if (resp) {
        const data = await resp.json();
        if (data) this.cars = data;
      } else {
        console.log("something wrong");
      }
    },
    // saveCar() {
    //   const vm = this;
    //   vm.showForm = false;
    // },

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

    async saveCar() {
      if (this.$refs.carForm.validate()) {
        let respPosterData = null;
        if (this.imageFile !== "") {
        const respPoster = await utils.http.postMedia(
          "/car/file/create",
          this.imageFile,
          this.imageFile.type
        );
        if (respPoster.status === 200) {
          this.showResult=true;
          this.result="Successfully save Car!"
          respPosterData = await respPoster.text();
        } else {

        }
        } else {
          respPosterData = this.tmpImagePath;
        }

        if (this.newCar.id == null) {
        if (respPosterData) {
          const respCar = await utils.http.post("/car/create", {
            name: this.newCar.name,
            brandId: this.newCar.brandId,
            categoryId: this.newCar.categoryId,
            discountId: this.newCar.discountId,
            status: this.newCar.status,
            quantity: this.newCar.quantity,
            price: this.newCar.price,
            waitingTime: this.newCar.waitingTime,
            isPublic: this.newCar.isPublic,
            availableTestDrive:this.newCar.availableTestDrive,
            description: this.newCar.description,
            imagePath: respPosterData,
            video: this.newCar.video
          });
          if (respCar.status === 200) {
            this.newCar = {};
            this.imageName = "";
            this.imageFile = "";
            this.imageUrl = "";
            this.showForm = false;
            this.getAllCar();
          } else {
          }
        }
        } else {
        if (respPosterData) {
          const respCar = await api.update("car/update/" +  + this.newCar.id, {
            id : this.newCar.id,
            name: this.newCar.name,
            brandId: this.newCar.brandId,
            categoryId: this.newCar.categoryId,
            discountId: this.newCar.discountId,
            status: this.newCar.status,
            quantity: this.newCar.quantity,
            price: this.newCar.price,
            waitingTime: this.newCar.waitingTime,
            isPublic: this.newCar.isPublic,
            availableTestDrive:this.newCar.availableTestDrive,
            description: this.newCar.description,
            imagePath: respPosterData,
            video: this.newCar.video
          });
          if (respCar.status === 200) {
            console.log(respCar)
            this.newCar = {};
            this.imageName = "";
            this.imageFile = "";
            this.imageUrl = "";
            this.showForm = false;
            this.getAllCar();
          } else {
          }
        }
        }

      } else {
        this.error = "Please check required fields";
        this.showError = true;
      }
    },

    async edit(props) {
      const resp = await api.get("car/" + props.item.id);
      if (resp) {
        const data = await resp.json();
        if (data) {
          this.newCar.id = data.id;
          this.newCar.name = data.name;
          this.newCar.brandId = data.brandId;
          this.newCar.categoryId = data.categoryId;
          this.newCar.discountId = data.discountId;
          this.newCar.status = data.status;
          this.newCar.quantity = data.quantity;
          this.newCar.price = data.price;
          this.newCar.waitingTime = data.waitingTime;
          this.newCar.isPublic = data.isPublic;
          this.newCar.availableTestDrive=data.availableTestDrive;
          this.newCar.video = data.video;
          this.newCar.description = data.description;
          this.imageUrl = this.localDomain + '/car' + data.imagePath;
          this.tmpImagePath = data.imagePath,
          this.showForm = true;
        }
      } else {
        console.log("something wrong");
      }
    },

    async deleteItem(props) {
      this.deleteDialog = true;
      this.selectDemo = props.item;
    },

    async deleteCar(id) {
      const resp = await api.remove("car/delete/" + id);
      if (resp.status == 200) {
        this.deleteDialog = false;
        await this.getAllCar();
      } else {
        console.log("sth wrong in delete id");
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
    await this.getAllCategorys();
    await this.getAllBrands();
    await this.getAllDiscount();
    await this.getAllCar();
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
</style>
