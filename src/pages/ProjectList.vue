<template>
  <div class="content">
    <div v-if="error" class="message">
      <h3 style="text-align: center">{{ error }}</h3>
    </div>
    <div v-else-if="projectData.length > 0">
      <div class="projectContent">
        <a
          v-for="(project, index) in projectData"
          :key="index"
          class="project-card"
          :href="'/callquotation?projectId=' + project.id"
          @click="setProjectId(project.id, project.title)">
          <img :src="require(`@/assets/img/project1.jpg`)" />
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
    };
  },
  mounted() {
    this.projectList();
  },
  methods: {
    async projectList() {
      try {
        const { data, message } = await ProjectController.projectList();
        this.error = message;
        this.projectData = data;
      } catch (error) {
        this.error = error.message;
      }
    },
    setProjectId(projectId, projectName) {
    localStorage.setItem('projectId', projectId);
    localStorage.setItem('projectName', projectName);
  },
  },
};
</script>

