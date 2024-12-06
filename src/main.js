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

let maintenanceMessage = null; // Initialize maintenance state

// Function to perform maintenance check
async function checkMaintenance() {
  try {
    // Fetch the maintenance state from the controller
    maintenanceMessage = await MaintenanceController.checkMaintenance();
    if (router.currentRoute.path === '/nofound') {
      router.push('/projectlist');
    }
  } catch (fetchError) {
    console.error("Error during maintenance check:", fetchError);
    // Redirect to '/nofound' if maintenance check fails
    if (router.currentRoute.path !== "/nofound") {
      router.push("/nofound");
    }
  }
}

// Function to set up the router guard
function setupRouterGuard() {
  router.beforeEach((to, from, next) => {
    // Always allow access to the maintenance page
    if (to.path === "/maintenance") {
      next();
      return;
    }

    // Redirect to '/maintenance' if maintenance is active
    if (maintenanceMessage?.isMaintenance === 1) {
      console.log("Redirecting to maintenance:", maintenanceMessage);
      next({
        path: "/maintenance",
        query: { end: maintenanceMessage.end },
      });
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
  await checkMaintenance(); // Perform the maintenance check
  setupRouterGuard(); // Set up the router guard

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
