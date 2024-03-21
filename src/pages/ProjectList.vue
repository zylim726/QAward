<template>
  <div>
    <h1>Sitelist</h1>
    <ul>
      <li v-for="site in sites" :key="site.id">{{ site.name }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      sites: []
    };
  },
  mounted() {
    this.fetchSiteList(); // Ensure that you're calling the method here
  },
  methods: {
  async fetchSiteList() {
    try {

      const response = await axios.get(`https://subconbackend.tribit.com.my/sitelist/zylim/SSA`, {
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inp5bGltIiwiaWF0IjoxNzEwOTIxNTIzLCJleHAiOjE3NDI0NTc1MjN9.PUhEtnO-i0kKu_N6WW6I_WK0KQyOEhe6Na98H43Rpiw"
        }
      });
      
      if (!response || !response.data) {
        console.error('Invalid response:', response);
        return;
      }
      
      this.sites = response.data;
      console.log('Response data:', this.sites);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }
}



};
</script>
