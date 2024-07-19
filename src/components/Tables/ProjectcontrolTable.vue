<template>
  <md-card-content>
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
        <button class="btn-save" @click="addAdminField">Add Admin Access</button><br />
      </div>

      <div v-else>
        <div v-for="(item, index) in getUserHaveDT" :key="item.id" style="margin-bottom: 15px;">
          <label><b>{{ getAdminLabel(index) }}</b></label>
          <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="display: flex;">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-5">
              <button class="transparentButton" @click="deleteAdminField(index, $event)">
                <md-icon style="color:orange;margin-top:5px;margin-left:-15px">delete_forever</md-icon>
              </button>
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
        <button class="btn-save" @click="addAdminField">Add Admin Access</button><br />
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
      adminSelection: [],
      users: [],
      getDTProject: null,
      getUserHaveDT: [],
    };
  },
  async mounted() {
    await this.accessUsers();
    await this.getProjectData();
    this.adminSelection = Array(this.adminList.length).fill('');
  },
  computed: {
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
    addAdminField() {
      const newAdmin = { id: 0, system_user_id: '' };
      this.getUserHaveDT.push(newAdmin);
      this.adminSelection.push('');
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
