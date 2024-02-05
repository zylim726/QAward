<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <h4 class="menutitle">Summary</h4><hr class="sidebar-divider">
      <sidebar-link to="/summarycomparison">
        <md-icon>library_books</md-icon>
        <p>Summary Subcon</p>
      </sidebar-link>
      <sidebar-link to="/">
        <md-icon>check_circle_outline</md-icon>
        <p>Summary Approval</p>
      </sidebar-link>
      
      <h4 class="menutitle">Master</h4><hr class="sidebar-divider">
      <sidebar-link to="/">
        <md-icon>wysiwyg</md-icon>
        <p>Subcon List</p>
      </sidebar-link>
      <sidebar-link to="/">
        <md-icon>content_paste</md-icon>
        <p>Trade List</p>
      </sidebar-link>
      <h4 class="menutitle">Admin</h4><hr class="sidebar-divider">
      <sidebar-link to="/">
        <md-icon>person</md-icon>
        <p>Admin</p>
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

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/presentation/pages/Layout/MobileMenu.vue";


export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
  },
  data() {
    return {
      sidebarBackground: "orange",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
    };
  },
};
</script>


<style>
.menutitle{
  margin-left: 22px;
    color: orange;
    font-weight: 400;
}
.sidebar-divider {
  border: none;
    border-top: 0.2px solid rgba(180, 180, 180, 0.3);
    margin: 1px 18px;
    width: 87%;
}
</style>
