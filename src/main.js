import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import store from "@/services/axios/store";
import config from "@/services/axios/config.js";

// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./models/plugin/globalComponents";
import Dashboard from "./models/plugin/dashboard";
import Modal from "./models/plugin/modal";

import Chartist from "chartist";

// configure router
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: "nav-item active",
});



const isMaintenanceMode = true; 

router.beforeEach((to, from, next) => {
  if (isMaintenanceMode) {
    // Redirect all users to the maintenance page
    if (to.path !== '/maintenance') {
      next('/maintenance');
    } else {
      next(); // Allow access to the maintenance page
    }
  } else {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = store.state.token !== null;
    if (requiresAuth && !isAuthenticated) {
      next('/login');
    } else {
      next();
    }
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
