<template>
  <div style="margin-top: 55px;">
    <button class="create-button">Create</button>
    <article
      v-for="(postcard, index) in postcards"
      :key="index"
      :class="['postcard', 'light', postcard.colorClass]"
    >
      <a class="postcard__img_link" href="#">
        <img class="postcard__img" :src="postcard.imgSrc" alt="Image Title" />
      </a>
      <div class="postcard__text t-dark">
        <h1 :class="['postcard__title', postcard.colorClass]">{{ postcard.title }}</h1>
        <div class="postcard__subtitle small">
          <time :datetime="postcard.date">
            <i class="fas fa-calendar-alt mr-2"></i> {{ new Date(postcard.date).toDateString() }}
          </time>
        </div>
        <div class="postcard__bar"></div>
        <div class="postcard__preview-txt">{{ postcard.description }}</div>
        <ul class="postcard__tagbox">
          <li class="tag__item"><i class="fas fa-tag mr-2" style="color: orange"></i> Edit</li>
          <li class="tag__item"><i class="fas fa-cut" style="color: orange"></i> Delete</li>
        </ul>
      </div>
    </article>
  </div>
</template>



<script>
export default {
  data() {
    return {
      postcards: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // Fetch your data here (mocking the data for example)
      // Replace with actual API call if necessary
      const data = [
        { title: "BQ Import Performance Boost", date: "2024-10-22", description: "This enhancement significantly speeds up the BigQuery import process, allowing for faster and more efficient data handling, ultimately reducing wait times for users.", imgSrc: "https://picsum.photos/1000/1000" },
        { title: "Default Comparison Table Simplified", date: "2024-10-22", description: " The comparison table has been streamlined by default, providing a clearer and more intuitive layout that facilitates easier analysis of key information at a glance.", imgSrc: "https://picsum.photos/501/500" },
        { title: "Interface Issues Resolved", date: "2024-10-22", description: "We have addressed various interface issues, leading to improved functionality and a smoother user experience, ensuring users can navigate the platform with ease.", imgSrc: "https://picsum.photos/1000/1500" },
        // Add more items as needed
      ];

      // Assign color based on index: orange for odd, red for even
      this.postcards = data.map((item, index) => ({
        ...item,
        colorClass: (index + 1) % 2 !== 0 ? 'orange' : 'red' // 1,3,5... -> orange; 2,4,6... -> red
      }));
    }
  }
};
</script>



