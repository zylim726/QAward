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
            placeholder="Search by project code "
          />
        </form>
      </div>
      
      <div class="filter-container" style="margin-right: -15px">
        <button class="btn-save" @click="showModal = true" >
          Add
        </button>
        <Createproject :show-modal="showModal"  @message="ModalMessage" @fail-message="ModalErrorMessage"  @close="closeModal" title="Create Project"></Createproject>
      </div>
    </div>
    <div class="table-container" style="max-height: 700px; overflow-y: auto">
      <table class="nested-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Code</th>
            <th>Name</th>
            <th>Area</th>
            <th>Reg No</th>
            <th style="text-align: center;">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(projects, index) in filterProject" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ projects.code }}</td>
            <td>{{ projects.name }}</td>
            <td>{{ projects.area }}</td>
            <td>{{ projects.regno }}</td>
            <td style="text-align: center">
              <button class="transparentButton"  @click="editProj(projects.id)" style="margin-left: -6px;"><md-icon style="color: orange !important;">edit</md-icon></button>

            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
    <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
    <EditProject
      :edit-project="showEditModal"
      @editMessage="EditMessage"
      @editfail-message="EditErrorMessage"
      @close="closeEditModal"
      :id="editId"
      title="Edit Project"
    />

  </div>
</template>

<script>
import ProjectController from "@/services/controllers/ProjectController.js";
import Createproject from "@/components/Pop-Up-Modal/Createproject.vue";
import EditProject from "@/components/Pop-Up-Modal/EditProject.vue";


export default {
  components: {
    Createproject,
    EditProject,
     
  },
  data() {
    return {
      projects: [],
      searchText: "",
      errorMessage: null,
      UpdateMessage: null,
      FailMessage: null,
      showModal: false,
      showEditModal: false,
      editId: null,
    };
  },
  mounted() {
    this.accessProject();
  },
  computed: {
    filterProject() {
      return this.projects.filter((project) => {
        return project.code.toLowerCase().includes(this.searchText.toLowerCase());
      });
    },
  },
  methods: {
    async accessProject() {
      try {
        const processedData = await ProjectController.accessProject();
        this.projects = processedData;
      } catch (error) {
        this.errorMessage = "Error fetching project data: " + error.errorMessage;
      }
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
  } 
};
</script>


<style>
.nested-table td {
  padding: 15px !important;
}
</style>
