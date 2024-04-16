<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content" style="height: 40%; width: 25%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <input
          type="text"
          v-model="name"
          placeholder="name"
          class="typeInput"
          @focus="onInputFocus('Name')"
        />
      </div>
      <button
      class="btn-save"
      aria-label="close"
      @click.stop="closeModal"
    >
      Close
    </button>
    <button
      class="btn-save"
      aria-label="close"
      @click.stop="saveAndCloseModal"
    >
      Save
    </button>
    </div>
  </div>
</template>

<script>
import SubconController from "@/services/controllers/SubconController.js";
export default {
  props: {
    showModal: Boolean,
    title: String,
  },
  data() {
    return {
      name: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.name = "";
    },
    saveAndCloseModal() {
      this.addSubconToServer(this.name);
      this.closeModal();
    },
    onInputFocus(input) {},
    async addSubconToServer(name) {
      try {
        const UpdateMessage = await SubconController.addSubcon(name);
        this.$emit('message', UpdateMessage);
        setTimeout(function() {
            window.location.reload();
        }, 500); 
      } catch (error) {
        const FailMessage = "Error updating subcon: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
  },
};
</script>

