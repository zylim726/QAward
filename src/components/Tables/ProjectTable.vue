<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">
      {{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon>
    </div>
    <div v-if="FailMessage" class="notification fail">
      {{ FailMessage }} <md-icon>cancel</md-icon>
    </div>
    <div v-if="loading" class="spinner-border" role="status">
      <span class="visually-hidden">   
        <button class="transparentButton" style="margin-right: 10px;cursor: default;">
          <md-icon style="color: red;margin-bottom:10px;">autorenew</md-icon>
        </button> Loading...</span>
    </div>
    <div v-if="!loading" class="container" style="margin-top: 20px">
      <div class="search-container">
        <form class="Searchbar">
          <input
            type="text"
            v-model="searchText"
            placeholder="Search by project code"
          />
        </form>
      </div>
    </div>
    <div v-if="!loading" class="table-container" style="max-height: 700px; overflow-y: auto">
      <table class="nested-table" v-if="projects.length">
        <thead>
          <tr>
            <th>No</th>
            <th>Code</th>
            <th>Name</th>
            <th>Company Name</th>
            <th>Area</th>
            <th>Reg No</th>
            <th style="text-align: center;" v-if="hasAccess">Unit Type</th>
            <th v-if="hasAdminAccess">Admin Approved</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(project, index) in filterProject" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ project.code }}</td>
            <td>{{ project.name }}</td>
            <td>{{ project.billto }}</td>
            <td>{{ project.area }}</td>
            <td>{{ project.regno }}</td> 
            <td style="text-align: center" v-if="hasAccess">
              <button class="transparentButton" @click="editProj(project.id)" style="margin-left: -6px;" >
                <div class="tooltip">
                  <span class="tooltiptext">Set up unit type</span>
                  <md-icon   :style="{ color: getUnitTypeColor(project.id) }" >edit</md-icon>
                  <md-icon v-if="getUnitTypeColor(project.id) === 'red'" style="color: lightcoral;">warning</md-icon>
                </div>
              </button>
            </td>
            <td style="text-align: center" v-if="hasAdminAccess" >
              <button class="transparentButton" style="margin-left: -6px;" @click="goToProjectControl(project)">
                <div class="tooltip">
                  <span class="tooltiptext">Set up admin approved</span>
                  <md-icon :style="{ color: getManageTypeColor(project.id) }" >manage_accounts</md-icon>
                  <md-icon v-if="getManageTypeColor(project.id) === 'red'" style="color: lightcoral;">warning</md-icon>
                </div>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else style="text-align: center;" >
        <div v-if="!FailMessage">
        No projects available</div>
        </div>
      <br />
    </div>
    <EditProject
      :edit-project="showEditModal"
      @editMessage="EditMessage"
      @editfail-message="EditErrorMessage"
      @close="closeEditModal"
      :id="editId"
      title="Set up unit type"
    />
  </div> 
</template>

<script>
import ProjectController from "@/services/controllers/ProjectController.js";
import EditProject from "@/components/Pop-Up-Modal/EditProject.vue";
import { checkAccess } from "@/services/axios/accessControl.js";

export default {
  components: {
    EditProject,
  },
  data() {
    return {
      projects: [],
      unitTypes: [],
      unitTypeColors: {},
      manageTypeColors: {},
      hasAccess: false,
      hasAdminAccess: false,
      searchText: "",
      UpdateMessage: null,
      FailMessage: null,
      showModal: false,
      showEditModal: false,
      editId: null,
      loading: false,
    };
  },
  mounted() {
    this.accessProject();
    this.checkPermission();
  },
  computed: {
    filterProject() {
      return this.projects.filter((project) => {
        return (
          project &&
          (
            (project.code && project.code.toLowerCase().includes(this.searchText.toLowerCase())) ||
            (project.name && project.name.toLowerCase().includes(this.searchText.toLowerCase()))
          )
        );
      });
    },
  },
  methods: {
    goToProjectControl(project) {
      this.$router.push({ 
        path: '/projectcontrol', 
        query: { name: project.name, id: project.id }
      });
    },
    async checkPermission() {
      try {
        const permission = await checkAccess(); 
        const accessIds = ['Set Up Unit Type'];
        const accessAdmin = ['Set Up Approved'];
        this.hasAccess = accessIds.some(id => permission.includes(id));
        this.hasAdminAccess = accessAdmin.some(id => permission.includes(id));
      } catch (error) {
      }
    },
    async accessProject() {
      try {
        this.loading = true;
        const processedData = await ProjectController.accessProject();
         this.projects = processedData;
        await this.updateUnitTypeColors();
        await this.updateManageTypeColors();
      } catch (error) {
        this.loading = false;
        this.FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
      } finally {
        this.loading = false;
      }
    },
    async updateUnitTypeColors() {
    this.loading = true;
    try {
        for (const project of this.projects) {
          const unitType = await ProjectController.getUnitTypes(project.id);
          this.$set(this.unitTypeColors, project.id, unitType.length > 0 ? 'grey' : 'red');
        }
      } catch (error) {
        const failMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', failMessage);
      } finally {
        this.loading = false;
      }
    },
    getUnitTypeColor(projectId) {
      return this.unitTypeColors[projectId] || 'red';
    },
    async updateManageTypeColors() {

    this.loading = true;
    try {
        for (const project of this.projects) {
          const manager = await ProjectController.getProjectManage(project.id);
          this.$set(this.manageTypeColors, project.id, manager.length > 0 ? 'grey' : 'red');
        }
      } catch (error) {
        const failMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', failMessage);
      } finally {
        this.loading = false;
      }
    },
    getManageTypeColor(projectId) {
      return this.manageTypeColors[projectId] || 'red';
    },
    editProj(projectId) {
      this.editId = projectId;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    ModalMessage(message) {
      this.UpdateMessage = message;
      this.accessProject();
    },
    ModalErrorMessage(message) {
      this.FailMessage = message;
    },
    EditMessage(message) {
      this.UpdateMessage = message;
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    EditErrorMessage(message) {
      this.FailMessage = message;
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
  },
};
</script>
