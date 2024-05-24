<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success" style="margin-left: 15px;">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail" style="margin-left: 15px;">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-30"
        style="padding: 0px 17px"
      >
        <md-card>
          <projectcontrol-table :projectData="selectedProject" @message="ImportMessage"  @fail-message="ImportErrorMessage" ></projectcontrol-table>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-70"
      >
        <md-card>
          <md-card-content>
            <div v-if="error" class="message">
              <h3 style="text-align: center">{{ error }}</h3>
            </div>
            <div v-else-if="projectData.length > 0"></div>
            <div class="projectContent" style="grid-template-columns: repeat(4, 1fr) !important;grid-auto-rows: auto;">
              <a
                v-for="(project, index) in projectData"
                :key="index"
                class="project-card"
                @click="handleProjectClick(project)"
              >
                <img :src="require(`@/assets/img/project1.jpg`)" />
                <h3 style="text-align: center;">{{ project.title }}</h3>
              </a>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ProjectcontrolTable } from "@/components";
import ProjectController from "@/services/controllers/ProjectController.js";

export default {
  components: {
    ProjectcontrolTable,
  },
  data() {
    return {
      projectData: [],
      error: null,
      selectedProject: null,
      UpdateMessage: null,
      FailMessage: null,
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
    handleProjectClick(project) {
      this.selectedProject = { name: project.title, id: project.id };
    },
    ImportMessage(message) {
      if (!this.UpdateMessage) {
        this.UpdateMessage = message;
        setTimeout(() => {
          this.UpdateMessage = '';
          window.location.reload(); 
        }, 500);
      }
    },
    ImportErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.FailMessage = '';
        window.location.reload(); 
      }, 500);
    },
  },
};
</script>
