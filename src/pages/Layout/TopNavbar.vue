<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <md-list>
            <md-list-item href="projectList">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Project List</p>
            </md-list-item>

            <li class="md-list-item">
              <div class="md-list-item-content">
                <drop-down>
                  <md-button
                    slot="title"
                    class="md-button md-just-icon md-simple"
                    data-toggle="dropdown"
                  >
                    <md-icon>notifications</md-icon>
                    <span class="notification">5</span>
                    <p class="hidden-lg hidden-md">ProjectList</p>
                  </md-button>
                  <ul class="dropdown-menu dropdown-menu-right">
                    <li><a href="#">Notification</a></li>
                  </ul>
                </drop-down>
              </div>
            </li>

            <md-list-item href="user">
              <i class="material-icons">person</i>
              <p class="hidden-lg hidden-md">Profile</p>
            </md-list-item>

            <md-list-item @click="logout">
              <i class="material-icons">logout</i>
              <p class="hidden-lg hidden-md">Logout</p>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import store from "@/services/axios/store";

export default {
  data() {
    return {
      selectedEmployee: null,
      employees: [
        "Jim Halpert",
        "Dwight Schrute",
        "Michael Scott",
        "Pam Beesly",
        "Angela Martin",
        "Kelly Kapoor",
        "Ryan Howard",
        "Kevin Malone",
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    logout() {
      // Dispatch the clearToken action to clear token and access level
      store.dispatch("clearToken");

      // Optionally, redirect the user to another route upon successful logout
      this.$router.push("/logout");
    },
  },
};
</script>
