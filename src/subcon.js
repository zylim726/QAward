// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from "./components/SidebarPlugin";

// asset imports
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.css";
import "./assets/scss/subcon.scss";

// library auto imports
import "es6-promise/auto";


export default {
  install(Vue) {
    Vue.use(SideBar);
    Vue.use(VueMaterial);
  },
};
