<template>
  <div class="overlap">
    <modal ref="errorModal"></modal>
    <a href="#" class="simple-text">
      <img
        src="@/assets/img/background.jpg"
        alt=""
        style="width: 100%; height: 60%"
      />
    </a>
    <div class="overlay"></div>
    <div class="shape">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1440 120"
      >
        <path
          d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"
          fill="#ffff"
        ></path>
      </svg>
    </div>
    <div class="login">
      <form @submit.prevent="LoginSubmit">
        <div class="logo">
          <a href="#" class="simple-text">
            <img
              src="@/assets/img/subcon-logo.png"
              alt=""
              style="margin-left: 10px"
            />
          </a>
        </div>
        <p style="margin-left: 10px">
          Please sign in to Subcon Comparison &#128075;
        </p>
        <input type="text" v-model="username" placeholder="Enter Name" />
        <input
          type="password"
          v-model="password"
          placeholder="Enter Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Pop-Up-Modal/Modal.vue";
import LoginController from "@/services/controllers/LoginController";
import store from "@/services/axios/store";
export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async LoginSubmit() {
      try {
        const { token, username, userid, accesslevel, message, success } = await LoginController.login(this.username, this.password);
        localStorage.setItem('userid', userid);
        
        if (success) {
          store.dispatch('setToken', { token, username, accesslevel });
      
          this.$router.push({ name: 'Project List' });

        } else {
        this.$refs.errorModal.openModal('Error Message',message);
        }
      } catch (error) {
        this.$refs.errorModal.openModal('Error Message',error.errorMessage);
      }
     
    },
  },
};
</script>
