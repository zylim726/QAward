<template>
  <md-card-content>
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="titleHeader">Select Admin</h1>
          <span class="close-icon" @click="closeModal">&times;</span>
        </div><br>
        <input type="text" v-model="searchTerm" placeholder="Search username" class="dropdownSubcon" style="margin-right: 60%; height: 8%;"><br><br>
        <div style="height: 60%; overflow-y: auto;">
          <table class="user-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Username</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <input type="checkbox" v-model="selectedUsers" :value="user.id">
                </td>
                <td>{{ user.username }}</td>
                <td>{{ user.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>
        <button type="button" class="btn-save" @click="confirmSelection">Add</button>
      </div>
    </div>

    <!-- Form HTML -->
    <label class="titleHeader">Project Control Approval:</label><br />
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label><b>Project Site:</b></label>
        <h5 v-if="!projectData">Please select the project name on the right side.</h5>
        <h3 class="titleHeader" v-else>{{ projectData.name }}</h3>
      </div>

      <div v-if="!hasExistingAdmins">
        <div class="admin-fields">
          <div v-for="(admin, index) in adminList" :key="index" class="form-group">
            <label><b>{{ getAdminLabel(index) }}:</b></label>
            <select
              v-model="adminSelection[index]"
              id="Admin"
              class="form-control Admin-dropdown"
              required
              style="height: 38px !important;"
            >
              <option value="">Select Admin</option>
              <option v-for="user in availableUsers(index)" :key="user.id" :value="user.id">
                {{ user.username }}
              </option>
            </select>
          </div>
        </div>
        <button type="button" class="btn-save" @click="openModal" v-if="projectData">Add Admin Access</button><br />
      </div>

      <div v-else>
        <div v-for="(item, index) in getUserHaveDT" :key="item.id" style="margin-bottom: 15px;">
          <label><b>{{ getAdminLabel(index) }}</b></label>
          <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="display: flex;">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-5">
              <!-- <button type="button" class="transparentButton" @click="deleteAdminField(index, $event)">
                <md-icon style="color:orange;margin-top:5px;margin-left:-15px">delete_forever</md-icon>
              </button> -->
            </div>
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-95">
              <select
                v-model="getUserHaveDT[index].system_user_id"
                id="Admin"
                class="form-control Admin-dropdown"
                required
                style="height: 38px !important; width: 100%;"
              >
                <option value="">Select Admin</option>
                <option v-for="user in availableUsers(index)" :key="user.id" :value="user.id">
                  {{ user.username }}
                </option>
              </select>
              <br />
            </div>
          </div>
        </div>
        <br>
        <button type="submit" class="btn-save">Update</button>
        <button type="button" class="btn-save" @click="openModal" v-if="projectData">Add Admin Access</button><br />
      </div>
    </form>
    <br />
  </md-card-content>
</template>

<script>
import AccessUserController from "@/services/controllers/ConfigController.js";
import ProjectController from "@/services/controllers/ProjectController.js";

export default {
  props: {
    projectData: Object
  },
  data() {
    return {
      adminList: [],
      selectedOption: null,
      adminSelection: [],
      users: [],
      getDTProject: null,
      getUserHaveDT: [],
      isModalVisible: false,
      selectedUsers: [],  // Track selected user IDs from the modal
      searchTerm: '',
      selectedUserDetails: [] // To store selected user details from modal
    };
  },
  async mounted() {
    await this.accessUsers();
    await this.getProjectData();
    this.adminSelection = Array(this.adminList.length).fill('');
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    availableUsers() {
      return (adminIndex) => {
        const selectedAdmins = this.adminSelection.filter((adminId, index) => index !== adminIndex && adminId !== '');
        return this.users.filter(user => !selectedAdmins.includes(user.id));
      };
    },
    hasExistingAdmins() {
      return this.getUserHaveDT && this.getUserHaveDT.length > 0;
    },
  },
  watch: {
    projectData(newValue) {
      this.getProjectData(newValue);
    }
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    confirmSelection() {

      const formData = {
        projectId: this.projectData.id,
        admins: this.selectedUsers.map(userId => ({
          id: 0, // Placeholder value for id
          system_user_id: userId // Use userId from selectedUsers
        }))
      };

      this.projectcontrol(formData);
      this.closeModal();
    },
    getAdminLabel(index) {
      if (index === 0) return 'Check By';
      return `Admin ${index}`;
    },
    async getProjectData(projectDt) {
      try {
        const response = await ProjectController.getProjectData(projectDt);
        this.getDTProject = response.data;
        this.getUserHaveDT = response.data || [];
        this.adminSelection = this.getUserHaveDT.map(admin => admin.system_user_id || '');
      } catch (error) {
        this.$emit('fail-message', error.errorMessage);
      }
    },
    async accessUsers() {
      try {
        const users = await AccessUserController.accessUser();
        this.users = users;
      } catch (error) {
        this.$emit('fail-message', error);
      }
    },
    async deleteAdminField(index, event) {
      event.preventDefault(); // Prevent the default action of the button click event
      try {
        const adminToDelete = this.getUserHaveDT[index];
        await ProjectController.deleteProjectControl(adminToDelete.id);

        // Remove the admin from local data arrays
        this.getUserHaveDT.splice(index, 1);
        this.adminSelection.splice(index, 1);
        
        // Set adminDeleted flag to true to indicate admin deletion
        this.adminDeleted = true;
      } catch (error) {
        this.$emit('fail-message', error);
      }
    },
    submitForm() {
      const formData = {
        projectId: this.projectData.id,
        admins: this.hasExistingAdmins
          ? this.getUserHaveDT.map(admin => ({ id: admin.id, system_user_id: admin.system_user_id }))
          : this.adminList.map((admin, index) => ({ id: admin.id, system_user_id: this.adminSelection[index] }))
      };
      this.projectcontrol(formData);
    },
    async projectcontrol(formData) {
      console.log('formData',formData);
      try {
        const successMessage = await ProjectController.projectcontrol(formData);
        const concatenatedMessage = successMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.$emit('message', Message);
      } catch (error) {
        this.$emit('fail-message', error);
      }
    },
  }
};
</script>


<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  text-align: center;
  width: 500px;
  overflow-y: clip;
  height: 600px !important;
  position: relative;
}

.file-upload-container {
  display: flex;
  align-items: center;
  margin: 20px 0px 18px 97px;
}

.close-icon {
  position: absolute;
    top: 28px;
    right: 27px;
    font-size: 26px;
    cursor: pointer;
}

</style>