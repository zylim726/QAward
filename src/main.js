import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import store from "@/services/axios/store";
import config from "@/services/axios/config.js";
import MaintenanceController from "@/services/controllers/MaintenanceController.js";

// Router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./models/plugin/globalComponents";
import Dashboard from "./models/plugin/dashboard";
import Modal from "./models/plugin/modal";
import WijmoPlugin from "./models/plugin/wijmo";
import Chartist from "chartist";

console.log('Backend Host:', process.env.VUE_APP_QAWARD_BACKEND_HOST);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: "nav-item active",
});

let maintenanceMessage;

// Function to perform maintenance check
async function checkMaintenance() {
  try {
    maintenanceMessage = await MaintenanceController.checkMaintenance();
    if (router.currentRoute.path === '/nofound') {
      router.push('/projectlist');
    }
  } catch (fetchError) {
    if (router.currentRoute.path !== '/nofound') {
      router.push('/nofound');
    }
    throw new Error('Server down or maintenance check failed');
  }
}

// Run the maintenance check once at startup
checkMaintenance().then(() => {
  // Setup router guard after maintenance check
  router.beforeEach((to, from, next) => {
    if (to.path === "/maintenance") {
      next();
      return;
    }

    console.log('Checking maintenance status:', maintenanceMessage);
    if (maintenanceMessage.isMaintenance === 1) {
      next({
        path: "/maintenance",
        query: { end: maintenanceMessage.end },
      });
      return;
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = store.state.token !== null;
    if (requiresAuth && !isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  });
}).catch((error) => {
  if (router.currentRoute.path !== '/nofound') {
    router.push('/nofound');
  }
});

Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(Dashboard);
Vue.use(GlobalComponents);
Vue.use(Modal);
Vue.use(WijmoPlugin);

new Vue({
  store,
  el: "#app",
  render: (h) => h(App),
  router,
  data: {
    Chartist: Chartist,
  },
  created() {
    this.$config = config;
  },
});
