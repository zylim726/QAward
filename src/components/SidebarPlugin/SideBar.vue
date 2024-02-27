<template>
  <div
    class="sidebar"
    :data-color="sidebarItemColor"
    :data-image="sidebarBackgroundImage"
    :style="sidebarStyle"
  >
    <div class="logo-image">
      <a href="#"  ><img :src="imgLogo" alt="" /></a> 
    </div>
    <div class="logo-mini">
      <a href="#"  ><img :src="imgLogoMinimized" alt="" /></a> 
    </div>
    <div class="sidebar-wrapper">
      <slot name="content"></slot>
      <md-list class="nav">
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            :link="link"
          >
          </sidebar-link>
        </slot>
      </md-list>
    </div>
  </div>
</template>
<script>
import SidebarLink from "./SidebarLink.vue";

export default {
  components: {
    SidebarLink,
  },
  props: {
    title: {
      type: String,
      default: "Subcon Comparison",
    },
    sidebarBackgroundImage: {
      type: String,
      default: require("@/assets/img/sidebar.jpg"),
    },
    imgLogo: {
      type: String,
      default: require("@/assets/img/subcon-logo.png"),
    },
    imgLogoMinimized: {
      type: String,
      default: require("@/assets/img/logo-mini.png"),
    },
    sidebarItemColor: {
      type: String,
      default: "orange",
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.sidebarBackgroundImage})`,
      };
    },
  },
};
</script>
<style>
@media screen and (min-width: 991px) {
  .nav-mobile-menu {
    display: none;
  }
}

.sidebar:not(:hover) .logo-image {
  display: none !important;
}

.sidebar:hover .logo-mini {
  display: none !important;
  
}

</style>

