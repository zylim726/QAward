<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }}</div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }}</div>
    <div class="container" style="margin-top: 20px">
      <div class="search-container">
        <form class="Searchbar">
          <input
            type="text"
            v-model="searchText"
            @input="filterpermissions"
            placeholder="Search by username"
          />
        </form>
      </div>
      <div class="filter-container" style="margin-right: -15px">
        <button class="btn-save" @click="updateSelectedpermissions">
          Updated
        </button>
        <button class="btn-save" @click="showModal = true">
          Add
        </button>
        <Createpermission :show-modal="showModal" @success-message="handleSuccessMessage"  @close="closeModal" title="Create Permission"></Createpermission>
      </div>
    </div>
    
    <div class="table-container" style="max-height: 700px; overflow-y: auto">
      <table class="nested-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Permission</th>
            <th style="text-align: center">CM</th>
            <th style="text-align: center">PD</th>
            <th style="text-align: center">PM</th>
            <th style="text-align: center">QS</th>
            <th style="text-align: center">SSA</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(permission, index) in searchPermission" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ permission.permission }}</td>
            <td style="text-align: center">
              <input type="checkbox" v-model="permission.loginAllowed" true-value="1" false-value="0" @change="togglePermissionSelection(permission.id)" />
            </td>
            <td style="text-align: center">
              <input type="checkbox" v-model="permission.loginAllowed" true-value="1" false-value="0" @change="togglePermissionSelection(permission.id)" />
            </td>
            <td style="text-align: center">
              <input type="checkbox" v-model="permission.loginAllowed" true-value="1" false-value="0" @change="togglePermissionSelection(permission.id)" />
            </td>
            <td style="text-align: center">
              <input type="checkbox" v-model="permission.loginAllowed" true-value="1" false-value="0" @change="togglePermissionSelection(permission.id)" />
            </td>
            <td style="text-align: center">
              <input type="checkbox" v-model="permission.loginAllowed" true-value="1" false-value="0" @change="togglePermissionSelection(permission.id)"/>
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
import PermissionController from "@/services/controllers/PermissionController.js";
import Createpermission from "@/components/Modal/Createpermission.vue";

export default {
  components: {
    Createpermission
  },
  data() {
    return {
      permissions: [],
      searchText: "",
      errorMessage: null,
      selectedUserIds: [],
      UpdateMessage: null,
      FailMessage: null,
      showModal: false,
    };
  },
  mounted() {
    this.permissionAccess();
  },
  computed: {
    searchPermission() {
      return this.permissions.filter((permission) => {
        return permission.permission
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
      });
    },
  },
  methods: {
    async permissionAccess() {
      try {
        this.permissions = await PermissionController.permissionAccess();
      } catch (error) {
        this.errorMessage = "Error fetching permission data: " + error.errorMessage;
      }
    },
    async updatePermissionAccess(permission) {
      try {
        const message  = await PermissionController.updatepermission(permission);
        this.UpdateMessage = message;
      } catch (error) {
        this.FailMessage = "Error updating login access: " + error.errorMessage;
      }
    },
    updateSelectedpermissions() {
      // Iterate over selectedUserIds and update login access for each
      this.selectedUserIds.forEach(async (userId) => {
        const permission = this.permissions.find(u => u.id === userId);
        if (permission) {
          await this.updatePermissionAccess(permission);
        }
      });
    },
    togglePermissionSelection(userId) {
      const index = this.selectedUserIds.indexOf(userId);
      if (index !== -1) {
        this.selectedUserIds.splice(index, 1); 
      } else {
        this.selectedUserIds.push(userId);
      }
    },
    closeModal() {
      this.showModal = false; // Update the showModal prop to close the modal
    },
    handleSuccessMessage(message) {
      this.UpdateMessage = message;
    },
    filterpermissions() {},
  },
};
</script>

<style>
.nested-table th,
.nested-table td {
  padding: 19px !important;
}



</style>
