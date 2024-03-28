<template>
  <div class="overlap">
    <modal ref="errorModal"></modal>
    <a href="#" class="simple-text">
      <img
        src="@/assets/img/background.png"
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
      <form>
        <div class="logo">
          <a href="#" class="simple-text">
            <img
              src="@/assets/img/subcon-logo.png"
              alt=""
              style="margin-left: 10px"
            />
          </a>
        </div>
        <h4 style="text-align: center; margin-top: 30px; margin-bottom: 30px">
          You are Logged Out.
        </h4>
        <router-link to="/login" tag="button" style="color: white"
          >Login</router-link
        >
      </form>
    </div>
  </div>
</template>
