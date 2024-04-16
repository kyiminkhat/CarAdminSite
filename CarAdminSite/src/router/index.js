import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import Brand from '../pages/Brand.vue';
import Discount from '../pages/Discount.vue';
import Category from '../pages/Category.vue';
import CarList from '../pages/CarList.vue';
import DailySellReport from '../pages/DailySellReport.vue';
import Login from '../pages/core/Login.vue';
import AdminUserList from '../pages/AdminUserList.vue';
import AdminSetup from '../pages/AdminSetup.vue';
import TestDrive from '../pages/TestDrive.vue';



Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        breadcrumb: [
          { name: 'dashboard' }
        ]
      }
    },
    {
      path: '/brand',
      name: 'Brand',
      component: Brand,
      meta: {
        breadcrumb: [
          { name: 'Setups' },
          { name: 'brand' }
        ]
      }
    },

    {
      path: '/category',
      name: 'Category',
      component: Category,
      meta: {
        breadcrumb: [
          { name: 'Setups' },
          { name: 'category' }
        ]
      }
    },

    {
      path: '/discount',
      name: 'Discount',
      component: Discount,
      meta: {
        breadcrumb: [
          { name: 'Setups' },
          { name: 'discount' }
        ]
      }
    },

    {
      path: '/car',
      name: 'Car',
      component: CarList,
      meta: {
        breadcrumb: [
          { name: 'Setups' },
          { name: 'car' }
        ]
      }
    },
    {
      path: '/admin-set-up',
      name: 'AdminSetup',
      component: AdminSetup,
      meta: {
        breadcrumb: [
          { name: 'Setups' },
          { name: 'adminsetup' }
        ]
      }
    },
    {
      path: '/test-dirve',
      name: 'TestDrive',
      component: TestDrive,
      meta: {
        breadcrumb: [
          { name: 'Setups' },
          { name: 'TestDrive' }
        ]
      }
    },

    {
      path: '/daily-sell-report',
      name: 'DailySellReport',
      component: DailySellReport,

      meta: {
        breadcrumb: [
          { name: 'Reports' },
          { name: 'Daily Sell Report' }

        ]
      }
    },
    {
      path: '/admin-user-list',
      name: 'AdminUserList',
      component: AdminUserList,

      meta: {
        breadcrumb: [
          { name: 'Reports' },
          { name: 'User List' }

        ]
      }
    },

    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        allowAnonymous: true
      }
    },
  ]
});
