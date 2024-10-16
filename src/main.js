import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import store from "@/services/axios/store";
import config from "@/services/axios/config.js";
import MaintenanceController from "@/services/controllers/MaintenanceController.js";

// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./models/plugin/globalComponents";
import Dashboard from "./models/plugin/dashboard";
import Modal from "./models/plugin/modal";

import Chartist from "chartist";

//CONSOLE.LOG CHECK HOST
console.log('Backend Host:', process.env.VUE_APP_QAWARD_BACKEND_HOST);

// configure router
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: "nav-item active",
});

router.beforeEach(async (to, from, next) => {
  try {

    if (to.path === "/maintenance") {
      next(); // Already on maintenance page, no need to check
      return;
    }

    const maintenanceMessage = await MaintenanceController.checkMaintenance();
      console.log('end',maintenanceMessage.end);
      console.log('status',maintenanceMessage.isMaintenance);

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
    

  } catch (error) {
    next("/login");
  }
});



Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(Dashboard);
Vue.use(GlobalComponents);
Vue.use(Modal);

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
