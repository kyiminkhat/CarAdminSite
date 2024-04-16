<template>
  <v-navigation-drawer v-model="toggle" fixed app>
    <v-toolbar flat dark :color="$root.themeColor" class="toolbar">
      <router-link :to="{ name: 'Dashboard' }">
        <img src="./../../assets/Guru-Logo.png" width="36px" />
      </router-link>
      <router-link :to="{ name: 'Dashboard' }" class="text">
        Car GuRu
      </router-link>
    </v-toolbar>
    <v-list>
      <v-list-tile @click="changeRoute('Dashboard', 1)">
        <v-list-tile-action> <v-icon>dashboard</v-icon> </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 1 }, 'item-title']"
          >{{ $t("dashboard") }}</v-list-tile-title
        >
      </v-list-tile>

      <v-list-group prepend-icon="pageview">
        <v-list-tile slot="activator">
          <v-list-tile-title class="item-title">{{
            $t("Setups")
          }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="changeRoute('Brand', 4)">
          <v-list-tile-action ><v-icon>fa-brands fa-bandcamp</v-icon></v-list-tile-action>
          <v-list-tile-title
            :class="[{ active: selectedIndex === 4 }, 'item-title']"
            >{{ $t("brand") }}</v-list-tile-title
          >
        </v-list-tile>
        <v-list-tile @click="changeRoute('Category', 5)">
          <v-list-tile-action> <v-icon>fa-brands fa-delicious</v-icon> </v-list-tile-action>
          <v-list-tile-title
            :class="[{ active: selectedIndex === 5 }, 'item-title']"
            >{{ $t("category") }}</v-list-tile-title
          >
        </v-list-tile>
        <v-list-tile @click="changeRoute('Discount', 6)">
          <v-list-tile-action> <v-icon>fa-solid fa-percent</v-icon> </v-list-tile-action>
          <v-list-tile-title
            :class="[{ active: selectedIndex === 6 }, 'item-title']"
            >{{ $t("discount") }}</v-list-tile-title
          >
        </v-list-tile>

        <v-list-tile @click="changeRoute('Car', 7)">
          <v-list-tile-action> <v-icon>fa-solid fa-car</v-icon> </v-list-tile-action>
          <v-list-tile-title
            :class="[{ active: selectedIndex === 7 }, 'item-title']"
            >{{ $t("car") }}</v-list-tile-title
          >
        </v-list-tile>
        <v-list-tile @click="changeRoute('AdminSetup', 10)">
          <v-list-tile-action> <v-icon>fa-solid fa-user</v-icon> </v-list-tile-action>
          <v-list-tile-title
            :class="[{ active: selectedIndex === 10}, 'item-title']"
            >{{ $t("Adminsetup") }}</v-list-tile-title
          >
        </v-list-tile>

        <v-list-tile @click="changeRoute('TestDrive', 11)">
          <v-list-tile-action> <v-icon>fa-solid fa-car</v-icon> </v-list-tile-action>
          <v-list-tile-title
            :class="[{ active: selectedIndex === 11}, 'item-title']"
            >{{ $t("TestDrive") }}</v-list-tile-title
          >
        </v-list-tile>

      </v-list-group>

      <v-list-group prepend-icon="select_all">
        <v-list-tile slot="activator">
          <v-list-tile-title class="item-title">{{
            $t("Reports")
          }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="changeRoute('DailySellReport', 8)">
          <v-list-tile-action> <v-icon>fa-solid fa-calendar</v-icon> </v-list-tile-action>
          <v-list-tile-title
            :class="[{ active: selectedIndex === 8 }, 'item-title']"
            >{{ $t("Daily Sell Report") }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="changeRoute('AdminUserList', 9)">
          <v-list-tile-action> <v-icon>fa-solid fa-users</v-icon> </v-list-tile-action>
          <v-list-tile-title
            :class="[{ active: selectedIndex === 9}, 'item-title']"
            >{{ $t("User Lists") }}</v-list-tile-title>
        </v-list-tile>
      </v-list-group>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    toggle: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data() {
    return {
      selectedIndex: 1
    };
  },

  methods: {
    changeRoute(routeName, selectedIndex) {
      const vm = this;

      vm.selectedIndex = selectedIndex;

      return vm.$router.push({ name: routeName });
    }
  }
};
</script>

<style>
.toolbar {
  font-weight: bold;
  font-size: 18px;
}

.toolbar .text {
  padding-left: 15px;
  color: white;
  text-decoration: none;
}

.item-title {
  font-size: 17px;
  font-weight: 500;
}
.item-sub-title {
  font-size: 15px;
  font-weight: 500;
}

.active {
  font-weight: bold;
}
</style>
