<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="Inforrmodal-background" @click="closeModal"></div>
    <div class="Inforrmodal-content">
      <div class="Inforbox">
        <h1 class="Inforrtitle">{{ title }}</h1>
        <hr style="margin-top: -45px" />
        <br /><br />
        <p class="Inforrsubtitle">{{ body }}</p>
      </div>
    </div>
    <button class="closeIcon" @click="closeModal" aria-label="close">
      <md-icon class="mdIcon">close</md-icon>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      title: "",
      body: "",
    };
  },
  methods: {
    openModal(title, body) {
      this.title = title;
      this.body = body;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>
