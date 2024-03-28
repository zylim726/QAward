<template>
  <div>
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
      <div class="filter-container" style="margin-right: -15px">
        <button class="btn-save" @click="updateLoginAccess(user)">
          Updated
        </button>
      </div>
    </div>
    <div class="table-container" style="max-height: 700px; overflow-y: auto">
      <table class="nested-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Access Level</th>
            <th>Update Date</th>
            <th style="text-align: center">Login Access</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.accesslevel }}</td>
            <td>{{ user.updatedAt }}</td>
            <td style="text-align: center">
              <input
                type="checkbox"
                v-model="user.loginAllowed"
                true-value="1"
                false-value="0"
                @click="updateLoginAccess(user)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
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
        this.errorMessage = "Error fetching user data: " + error.message;
      }
    },
    async updateLoginAccess(user) {
      try {
        await AccessUserController.updateUserLoginAllowed(user);
        console.log("Suucess");
      } catch (error) {
        console.error("Error updating login access:", error); // Log any errors
      }
    },
    filterUsers() {},
  },
};
</script>

<style>
.nested-table th,
.nested-table td {
  padding: 19px !important;
}
</style>
