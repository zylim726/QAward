<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-30"
        style="padding: 0px 17px"
      >
        <md-card>
          <projectcontrol-table></projectcontrol-table>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-70"
      >
        <md-card>
          <md-card-content>
            <div class="projectContent">
              <a
                v-for="(data, index) in projectData"
                :key="index"
                class="project-card"
              >
                <img :src="require(`@/assets/img/${data.imageUrl}`)" />
                <h3>{{ data.title }}</h3>
                <h5>{{ data.description }}</h5>
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

export default {
  components: {
    ProjectcontrolTable,
  },
  data() {
    return {
      projectData: [
        { title: "AR496", description: "description", imageUrl: "project.jpg" },
        {
          title: "BH1-B3B4",
          description: "description",
          imageUrl: "project1.jpg",
        },
        {
          title: "BKT22F",
          description: "description",
          imageUrl: "project3.jpg",
        },
        {
          title: "BKT2PS",
          description: "description",
          imageUrl: "no-image.png",
        },
        { title: "CU1C", description: "description", imageUrl: "project2.jpg" },
        {
          title: "FORUM2",
          description: "description",
          imageUrl: "no-image.png",
        },
        { title: "EG2", description: "description", imageUrl: "project1.jpg" },
        { title: "CYSA", description: "description", imageUrl: "project.jpg" },
        {
          title: "PG OFFICE",
          description: "description",
          imageUrl: "project3.jpg",
        },
        {
          title: "KL OFFICE",
          description: "description",
          imageUrl: "project2.jpg",
        },
        { title: "MK1", description: "description", imageUrl: "project1.jpg" },
        { title: "MK3", description: "description", imageUrl: "no-image.png" },
        { title: "MK7", description: "description", imageUrl: "project.jpg" },
      ],
    };
  },
};
</script>
