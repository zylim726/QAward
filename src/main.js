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

console.log("Backend Host:", process.env.VUE_APP_QAWARD_BACKEND_HOST);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    ...routes,
    {
      path: "*", // Catch-all route
      component: () => import("@/pages/Nolink.vue"),
    },
  ],
  linkExactActiveClass: "nav-item active",
});

let getIsMaintenance = null; // Initialize maintenance state

// Function to set up router guard and perform maintenance checks
async function setupRouterGuard() {
  try {
    // Fetch maintenance state
    getIsMaintenance = await MaintenanceController.checkMaintenance();
  } catch (fetchError) {
    console.error("Error fetching maintenance state:", fetchError);
    router.push("/nofound");
    return;
  }

  router.beforeEach((to, from, next) => {

    console.log('getIsMaintenance',getIsMaintenance.isMaintenance);

    // Always allow access to the maintenance page
    if (to.path === "/maintenance") {
      if(getIsMaintenance.isMaintenance === 0){
        next("/projectlist");
        return;
      }else {
        next();
        return;
      }
    }

    // Redirect based on maintenance status
    if (getIsMaintenance?.isMaintenance === 1) {
      next({
        path: "/maintenance",
        query: { end: getIsMaintenance.end },
      });
      return;
    }

    // Handle navigation after maintenance ends
    if (getIsMaintenance?.isMaintenance === 0 && to.path === "/nofound") {
      next("/projectlist");
      return;
    }

    // Authentication guard
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = store.state.token !== null;
    if (requiresAuth && !isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  });
}

// Initialize the app
async function initializeApp() {
  await setupRouterGuard(); // Perform maintenance check and set up router guard

  // Start Vue instance
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
}

// Start the initialization process
initializeApp();

Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(Dashboard);
Vue.use(GlobalComponents);
Vue.use(Modal);
Vue.use(WijmoPlugin);
