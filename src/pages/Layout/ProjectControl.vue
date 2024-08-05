<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success" style="margin-left: 15px;">
      {{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon>
    </div>
    <div v-if="FailMessage" class="notification fail" style="margin-left: 15px;">
      {{ FailMessage }} <md-icon>cancel</md-icon>
    </div>
    <div class="md-layout" style="display: flex; overflow: hidden;">
      <div 
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-30"
        style="padding: 0px 17px; position: sticky; left: 0; height: 100vh; overflow: hidden; z-index: 1;"
      >
        <md-card>
          <projectcontrol-table 
            :projectData="selectedProject" 
            @message="ImportMessage"  
            @fail-message="ImportErrorMessage" 
          ></projectcontrol-table>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-70"
        style="flex: 1; overflow-x: auto; height: 100vh;"
      >
        <md-card>
          <md-card-content>
            <div v-if="projectData.length > 0"></div>
            <div class="projectContent" style="grid-template-columns: repeat(4, 1fr) !important; grid-auto-rows: auto;">
              <a
                v-for="(project, index) in projectData"
                :key="index"
                class="project-card"
                @click="handleProjectClick(project)"
              >
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
      selectedProject: JSON.parse(localStorage.getItem('projectData')) || null,
      UpdateMessage: null,
      FailMessage: null,
    };
  },
  mounted() {
    this.projectList();
  },
  watch: {
    selectedProject(newValue) {
      localStorage.setItem('projectData', JSON.stringify(newValue));
    },
  },
  methods: {
    async projectList() {
      try {
        const { data, message } = await ProjectController.projectList();
        this.FailMessage = message;
        this.projectData = data;
        // Restore the selected project from localStorage if available
        this.selectedProject = JSON.parse(localStorage.getItem('projectData')) || this.selectedProject;
      } catch (error) {
        this.FailMessage = error.message;
      }
    },
    handleProjectClick(project) {
      this.selectedProject = { name: project.title, id: project.id };
      // No need to manually save here; it's handled by the watcher
    },
    ImportMessage(message) {
      if (!this.UpdateMessage) {
        this.UpdateMessage = message;
        // Update the page state as needed without a page reload
        setTimeout(() => {
          this.UpdateMessage = '';
        }, 500);
      }
    },
    ImportErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.FailMessage = '';
      }, 500);
    },
  },
};
</script>
