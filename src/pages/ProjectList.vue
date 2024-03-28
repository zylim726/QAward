<template>
  <div class="content">
    <div v-if="error">
      <!-- Display error message if there's an error -->
      <h3 style="text-align: center">{{ error }}</h3>
    </div>
    <div v-else-if="projectData.length > 0">
      <div class="projectContent">
        <a
          v-for="(project, index) in projectData"
          :key="index"
          class="project-card"
          href="/callquotation"
        >
          <img :src="require(`@/assets/img/project1.jpg`)" />
          <h3 style="text-align: center">{{ project.title }}</h3>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectController from "@/services/controllers/ProjectController.js";
import Error from "@/models/error";

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
        const response = await ProjectController.projectList();

        if (response.data.length === 0) {
          this.error = Error.getMessage(501);
        } else {
          this.projectData = response.data.map((project) => ({
            title: project.name,
          }));
        }
      } catch (error) {
        this.error = Error.getMessage(504);
      }
    },
  },
};
</script>
