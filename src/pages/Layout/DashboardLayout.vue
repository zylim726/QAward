<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>

      <sidebar-link class="navbar-link" to="/callquotation">
        <md-icon>check_circle_outline</md-icon>
        <p class="nav-item">Comparison Summary</p>
      </sidebar-link>

      <h4 class="menutitle">Master</h4>
      <sidebar-link class="navbar-link" to="/projectsetup">
        <md-icon>content_paste</md-icon>
        <p class="nav-item">Project Setup</p>
      </sidebar-link>
      <sidebar-link class="navbar-link" to="/subcon">
        <md-icon>wysiwyg</md-icon>
        <p class="nav-item">Subcon List</p>
      </sidebar-link>
      <h4 class="menutitle">Admin</h4>
      <sidebar-link  class="navbar-link" to="/user">
        <md-icon>person</md-icon>
        <p class="nav-item">Admin</p>
      </sidebar-link>
      <sidebar-link   v-if="hasAccess('User Access')" class="navbar-link" to="/userconfig">
        <md-icon>manage_accounts</md-icon>
        <p class="nav-item">User Access</p>
      </sidebar-link>
      <sidebar-link  v-if="hasAccess('Access Permission')" to="/accesspermission">
        <md-icon>settings_applications</md-icon>
        <p class="nav-item">Access Permission</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <fixed-plugin
        :color.sync="sidebarBackground"
        :image.sync="sidebarBackgroundImage"
      >
      </fixed-plugin>

      <dashboard-content> </dashboard-content>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";
import { checkAccess } from "@/services/axios/accessControl.js";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu,
  },
  data() {
    return {
      sidebarBackground: "orange",
      sidebarBackgroundImage: require("@/assets/img/sidebar.jpg"),
      userPermissions: [],
    };
  },
  async created() {
    await this.checkPermission();
  },
  methods: {
    async checkPermission() {
      try {
        const permission = await checkAccess(); 
        this.userPermissions = permission;
      } catch (error) {
        console.error('Error checking permission:', error);
      }
    },
    hasAccess(permissionName) {
      return this.userPermissions.includes(permissionName);
    }
  }
};
</script>
