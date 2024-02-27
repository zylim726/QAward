<template>
    <div class="login">
      <div class="logo">
      <a href="#" class="simple-text"><img :src="imgLogo" alt="" style="margin-left: 10px;" /></a>
    </div>
      <p style="margin-left: 10px;">Please sign in  to Subcon Comparison &#128075;</p>
      <input type="text"  v-model="name" placeholder="Enter Name" />
      <input type="password"  v-model="password" placeholder="Enter Password" />
      <button v-on:click="Login">Login</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name : 'Login',
    data() {
        return {
            name:'',
            password:''
        }
    },
    methods: {
      async Login() {
        try {
          let result = await axios.get(
            `http://localhost:3000/admin?name=${this.name}&password=${this.password}`
          );

          if (result.status === 200 && result.data.length > 0) {
            localStorage.setItem("admin-info", JSON.stringify(result.data[0]));
            this.$router.push('/dashboard');  // Push to route after successful login
          } else {
            window.alert("Login failed: Admin data not found");
          }
        } catch (error) {
          window.alert("Error occurred while logging in");
        }
      }
    },
    mounted() {
      let admin = localStorage.getItem('admin-info');
      if (admin) {
        this.$router.push('/SummaryComparison');  // Push to route if admin info exists in localStorage
      }
    },
    props: {
      imgLogo: {
      type: String,
      default: require("@/assets/img/subcon-logo.png"),
    },
    }
  }
  </script>
  
