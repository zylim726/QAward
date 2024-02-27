<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar :sidebar-item-color="sidebarBackground" :sidebar-background-image="sidebarBackgroundImage" >
      <mobile-menu slot="content"></mobile-menu>
      
      <h4 class="menutitle" >Summary</h4>
      <sidebar-link class="navbar-link" to="/summarycomparison" style="margin-top: 10px;">
        <md-icon>library_books</md-icon>
        <p class="nav-item">Summary Subcon</p>
      </sidebar-link>
      <sidebar-link class="navbar-link" to="/comparison">
        <md-icon>check_circle_outline</md-icon>
        <p class="nav-item">Subcon Comparison</p>
      </sidebar-link>
      
      <h4 class="menutitle">Master</h4>
      <sidebar-link class="navbar-link" to="/subcon">
        <md-icon>wysiwyg</md-icon>
        <p class="nav-item">Subcon List</p>
      </sidebar-link>
      <sidebar-link class="navbar-link" to="/trade">
        <md-icon>content_paste</md-icon>
        <p class="nav-item">Trade List</p>
      </sidebar-link>
      <h4 class="menutitle">Admin</h4>
      <sidebar-link class="navbar-link" to="/admin">
        <md-icon>person</md-icon>
        <p class="nav-item">Admin</p>
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
    };
  },
};
</script>

<style>

.sidebar {
  width: 4% !important;
  position: absolute !important;
  top: 0 !important;
  bottom: 0 !important;
  height: 100% !important;
  overflow: hidden !important;
  transition: width 0.2s linear !important;
  z-index: 10; /* Set a default z-index */
}

.nav-item {
  position: relative;
  margin-left: 10px;
}


.sidebar:hover {
  width: 16.5% !important;
  transition: all 0.5s ease !important;
  z-index: 5; /* Increase the z-index on hover */

}


.sidebar:not(:hover) .menutitle, 
.sidebar:not(:hover) .sidebar-divider {
  display: none !important;
}



</style>
