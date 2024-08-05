<template>
  <div class="content">
    <div v-if="loading" class="spinner-border" role="status">
      <span class="visually-hidden">
        <button class="transparentButton" style="margin-right: 10px; cursor: default;">
          <md-icon style="color: red; margin-bottom: 10px;">autorenew</md-icon>
        </button> Loading...
      </span>
    </div>
    <div v-if="error" class="notification fail">{{ error }}<md-icon>cancel</md-icon>
    </div>
    <div v-else-if="projectData.length > 0">
      <div class="projectContent">
        <a
          v-for="(project, index) in projectData"
          :key="index"
          class="project-card"
          v-if="project.title" 
          :href="'/callquotation?projectId=' + project.id"
          @click="setProjectId(project.id, project.title)">
          <h3 style="text-align: center">{{ project.title }}</h3>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectController from "@/services/controllers/ProjectController.js";

export default {
  data() {
    return {
      projectData: [],
      error: null,
      loading: false,
    };
  },
  mounted() {
    this.projectList();
  },
  
  methods: {
    async projectList() {
      try {
        this.loading = true;
        const { data, message } = await ProjectController.projectList();
        if (data) {
          this.projectData = data;
        } else {
          this.error = message || "An unknown error occurred.";
        }
      } catch (error) {
        this.error = `Error Message: ${error.message || 'Unknown error'}`;
      } finally {
        this.loading = false;
      }
    },
    setProjectId(projectId, projectName) {
      localStorage.setItem('projectId', projectId);
      localStorage.setItem('projectName', projectName);
    },
  },
};
</script>
