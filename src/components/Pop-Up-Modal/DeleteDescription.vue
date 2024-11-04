<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content" style="width: 25%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <md-icon style="text-align: center;font-size: 79px !important;margin-left:9%;color: red;margin-top: 19px;">highlight_off</md-icon>
        <p class="Inforrsubtitle" style="margin-top: 50px;">Please confirm deletion of the data !</p>
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
      @click.stop="saveAndCloseModal(id)"
    >
      OK
    </button>
    </div>
    </div>
  </div>
</template>

<script>
import DescriptionController from "@/services/controllers/DescriptionController.js";

export default {
  props: {
    showModal: Boolean,
    title: String,
    id: Array 
  },
  data() {
    return {
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    saveAndCloseModal(id) {
      this.removeDescription(id);
      this.closeModal();
    },
    async removeDescription(id) {
      try {

        const UpdateMessage = await DescriptionController.removeDescription(id);
        this.$emit('message', UpdateMessage);
        setTimeout(() => {
          window.location.reload();
        }, 1000); 
      } catch (error) {
        const FailMessage = `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', FailMessage);
      }
    }
  },
};
</script>

