<template>
  <div class="content">
    <div class="projectContent">
      <a
        v-for="(data, index) in projectData"
        :key="index"
        class="project-card"
        href="/callquotation"
      >
        <img :src="require(`@/assets/img/${data.imageUrl}`)" />
        <h3>{{ data.title }}</h3>
        <h5>{{ data.description }}</h5>
      </a>
    </div>
  </div>
</template>

<script>
export default {
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
