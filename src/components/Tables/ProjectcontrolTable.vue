<template>
  <md-card-content >
    <!-- Modal Popup -->
    <div v-if="isModalVisible" class="modal-overlay">
  <div class="modal-content" style="max-height: 510px !important;">
    <div class="modal-header">
      <h1 class="titleHeader">Select Admin</h1>
      <span class="close-icon" @click="closeModal">&times;</span>
    </div>
    <div class="header-row">
      <h5>Selected: <b style="font-size: 18px;">{{ SelecName }}</b></h5>
      <input type="text" v-model="searchTerm" placeholder="Search username" class="dropdownSubcon" style="height: 31px !important;">
    </div>
    <br>
    <div style="max-height: 300px; overflow-y: auto;">
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
              <input 
                type="radio" 
                :value="user.id"
                v-model="selectedUserId"
              >
            </td>
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br>
    <button type="button" class="btn-save" @click="confirmSelection">Submit</button>
  </div>
</div>


    <!-- Form HTML -->
    <label class="titleHeader">Project Control Approval:</label>
    <br />
    <form @submit.prevent="submitForm">
      <div class="form-group" style="padding:12px">
        <label><b>Project Site:</b></label>
        <h5 v-if="!projectData">Please select the project name on the right side.</h5>
        <h3 class="titleHeader" v-else>{{ projectData.name }}</h3>
      </div>

      <div v-for="(item, index) in getUserHaveDT" :key="item.id" style="margin-bottom: 15px;padding: 12px;">
        <label><b>Approval {{ index + 1 }}</b></label>
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="display: flex;">
          <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-5">
            <button type="button" class="transparentButton" @click="deleteAdminField(index, $event)">
              <md-icon style="color:orange;margin-top:5px;margin-left:-15px">delete_forever</md-icon>
            </button>
          </div>
          <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-90">
            <button type="button" class="form-control Admin-dropdown" @click="openModal(index)" style="border: none">
              {{ getAdminName(index) }} 
            </button>
          </div>
          <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-5">
            <button type="button" class="transparentButton" @click="openModal(index)" >
              <md-icon style="margin:3px 0px -11px -79px; color: orange;">arrow_drop_down_circle</md-icon>
            </button>
          </div>
        </div>
      </div>
      <br>
      <button type="button" class="btn-save" @click="addNewAdminField" v-if="projectData">Add Admin Access</button>
      <br />
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
      searchTerm: '',
      selectedUserId: null,
      currentAdminIndex: null,
      selectedUsers: [],
      selectedUserDetails: [],
      SelecName: null,
    };
  },
  async mounted() {
    await this.accessUsers();
    await this.getProjectData();
    this.adminSelection = Array(this.adminList.length).fill('');
  },
  computed: {
    filteredUsers() {
    const excludedUserIds = this.getUserHaveDT
      .filter((_, index) => index !== this.currentAdminIndex) 
      .map(admin => admin.system_user_id);

    if (this.currentAdminIndex !== null && this.getUserHaveDT[this.currentAdminIndex]) {
      excludedUserIds.push(this.getUserHaveDT[this.currentAdminIndex].system_user_id);
    }
    return this.users.filter(user =>
      !excludedUserIds.includes(user.id) &&
      (user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       user.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
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
    }
  },
  watch: {
    projectData(newValue) {
      this.getProjectData(newValue);
    }
  },
  methods: {
    getAdminName(index) {
      const userHaveDT = this.getUserHaveDT[index];
      if (userHaveDT && userHaveDT.system_user_id) {
        const user = this.users.find(user => user.id === userHaveDT.system_user_id);
        if (user) {
          return user.username;
        }
      }
      return 'Select Admin';
    },
    closeModal() {
      this.isModalVisible = false;
    },
    openModal(index) {
      this.isModalVisible = true; 
      this.currentAdminIndex = index;

      const userHaveDT = this.getUserHaveDT[index];
      if (userHaveDT && userHaveDT.system_user_id !== '') {
        const user = this.users.find(user => user.id === userHaveDT.system_user_id);
        if (user) {
          this.selectedUserId = user.id;
          this.SelecName = user.username;
        }else {
          this.selectedUserId = null;
        }
      }else {
        this.selectedUserId = null;
        this.SelecName = 'Select Admin';
      }
    },
    confirmSelection() {

      if (this.selectedUserId !== null && this.currentAdminIndex !== null) {
        // Find the selected user object
        const selectedUser = this.users.find(user => user.id === this.selectedUserId);
      
        // Update only the current admin's data with the selected user info
        this.getUserHaveDT[this.currentAdminIndex] = {
          ...this.getUserHaveDT[this.currentAdminIndex],
          system_user_id: this.selectedUserId,
          username: selectedUser ? selectedUser.username : 'Select Admin'
        };
        
        // Prepare the form data and submit
        const formData = {
          projectId: this.projectData.id,
          admins: [{
            id: this.getUserHaveDT[this.currentAdminIndex].id || 0,
            system_user_id: this.getUserHaveDT[this.currentAdminIndex].system_user_id
          }]
        };
        this.projectcontrol(formData);
        this.closeModal();
      } else {
        console.error('No user selected or invalid index!');
      }
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
      event.preventDefault(); 
      try {
        const adminToDelete = this.getUserHaveDT[index];
        await ProjectController.deleteProjectControl(adminToDelete.id);

        this.getUserHaveDT.splice(index, 1);
        this.adminSelection.splice(index, 1);

        this.adminDeleted = true;
      } catch (error) {
        this.$emit('fail-message', error);
      }
    },
    addNewAdminField() {
      this.getUserHaveDT.push({ id: null, system_user_id: '', username: 'Select Admin' });
      this.adminSelection.push('');
    },
    async projectcontrol(formData) {
      try {
     
        const successMessage = await ProjectController.projectcontrol(formData);
        const concatenatedMessage = successMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.$emit('message', Message);
      } catch (error) {
        this.$emit('fail-message', error);
      }
    }
  }
};
</script>



<style>


.modal-content {
  text-align: center;
  width: 500px;
  overflow-y: clip;
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

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>