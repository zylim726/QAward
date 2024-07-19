<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="container" style="margin-top: 20px">
      <div class="search-container">
        <form class="Searchbar">
          <input
            type="text"
            v-model="searchText"
            @input="filterUsers"
            placeholder="Search by username"
          />
        </form>
      </div>
    </div>
    <div class="table-container" style="max-height: 700px; overflow-y: auto">
      <table class="nested-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Name</th>
            <th>Access Level</th>
            <th style="text-align: center">Login Access</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.accesslevel }}</td>
            <td style="text-align: center">
              <input
                type="checkbox"
                :id="user.id"
                v-model="user.loginAllowed"
                true-value="1"
                false-value="0"
                @change="updateLoginAccess(user)"
              />
            </td>
          </tr>
         
        </tbody>
      </table>
      <br />
    </div>
    <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import AccessUserController from "@/services/controllers/ConfigController.js";

export default {
  data() {
    return {
      users: [],
      searchText: "",
      errorMessage: null,
      UpdateMessage: null,
      FailMessage: null,
    };
  },
  mounted() {
    this.accessUsers();
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        return user.username
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
      });
    },
  },
  methods: {
    async accessUsers() {
      try {
        this.users = await AccessUserController.accessUser();
      } catch (error) {
        this.errorMessage =  `Error Message: ${error.message || 'Unknown Data.'}`;
      }
    },
    async updateLoginAccess(user) {
      try {
        const message  = await AccessUserController.updateUserLoginAllowed(user);
        this.UpdateMessage = message;
        setTimeout(() => {
          window.location.reload();
      }, 2000);
      } catch (error) {
        this.FailMessage =  `Error Message: ${error.message || 'Unknown Data.'}`;
        setTimeout(() => {
          window.location.reload();
      }, 2000);
      }
    },
    filterUsers() {},
  },
};
</script>


