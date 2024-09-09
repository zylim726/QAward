<template>
  <div class="content">
    <!-- Search Bar -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        @input="filterProjects"
        placeholder="Search projects..."
        class="search-input"
      />
    </div>

    <!-- isLoading Indicator -->
    <div v-if="isLoading"><loading-modal /><br><br></div>

    <!-- Error Message -->
    <div v-if="error" class="notification fail">{{ error }}<md-icon>cancel</md-icon></div>

    <!-- Display Filtered Projects -->
    <div v-else-if="filteredProjects.length > 0" class="card-container">
      <div v-for="(project, index) in filteredProjects" :key="index" class="project-card">
        <h3 class="project-title">{{ project.title }}</h3>
        <a
          :href="'/callquotation?projectId=' + project.id"
          @click="setProjectId(project.id, project.title)"
          class="project-link"
        >
          View Details
        </a>
      </div>
    </div>

    <!-- No Projects Found -->
    <div v-else class="no-results">No projects found.</div>
  </div>
</template>

<script>
import ProjectController from "@/services/controllers/ProjectController.js";
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";

export default {
  components: {
      LoadingModal
    },
  data() {

    return {
      projectData: [],
      filteredProjects: [],
      error: null,
      isLoading: false,
      searchQuery: '',
    };
  },
  mounted() {
    this.projectList();
  },
  
  methods: {
    async projectList() {
      try {
        this.isLoading = true;
        const { data, message } = await ProjectController.projectList();
        if (data) {
          this.projectData = data;
          this.filteredProjects = data; // Initialize filteredProjects
        } else {
          this.error = message || "An unknown error occurred.";
        }
      } catch (error) {
        this.error = `Error Message: ${error.message || 'Unknown error'}`;
      } finally {
        this.isLoading = false;
      }
    },
    filterProjects() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProjects = this.projectData.filter(project =>
        project.title && project.title.toLowerCase().includes(query)
      );
    },
    setProjectId(projectId, projectName) {
      localStorage.setItem('projectId', projectId);
      localStorage.setItem('projectName', projectName);
    },
  },
};
</script>


<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 10px;
  border: 1px solid orange;
  border-radius: 4px;
  font-size: 16px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  padding: 20px;
}

.project-card {
  background-color: #ffffff;
  border: 0.5px solid orange; /* Orange border color */
  border-radius: 8px;
  padding: 0px 0px 20px 15px;
  width: 300px; 
}

.no-results {
  margin-top: 70px;
  font-size: 22px;
  text-align: center;
}


@media (max-width: 768px) {
  .project-card {
    width: calc(50% - 20px); /* 2 cards per row on medium screens */
  }
}

@media (max-width: 480px) {
  .project-card {
    width: calc(100% - 20px); /* 1 card per row on small screens */
  }
}
</style>
