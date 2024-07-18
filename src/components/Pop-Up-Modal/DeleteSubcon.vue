<template>
  <div class="modal" :class="{ 'is-active': deleteSubcon }">
    <div class="modal-background" @click="closeDeleteModal"></div>
    <div class="modal-content" style="width: 25%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <md-icon style="text-align: center;font-size: 79px !important;color: red;margin-top: 19px;">highlight_off</md-icon>
        <p class="Inforrsubtitle" style="margin-top: 50px;">Please confirm deletion of the data !</p>
      <button
      class="btn-save"
      aria-label="close"
      @click.stop="closeDeleteModal"
    >
      Close
    </button>
    <button
      class="btn-save"
      aria-label="close"
      @click.stop="saveAndCloseDeleteModal(id)"
    >
      OK
    </button>
    </div>
    </div>
  </div>
</template>

<script>
import SubconController from "@/services/controllers/SubconController.js";

export default {
  props: {
    deleteSubcon: Boolean,
    title: String,
    id: Number 
  },
  data() {
    return {
    };
  },
  methods: {
    closeDeleteModal() {
      this.$emit("close");
    },
    saveAndCloseDeleteModal(id) {
      this.removeSubcon(id);
      this.closeDeleteModal();
    },
    async removeSubcon(id) {
      try {
        const UpdateMessage = await SubconController.removeSubcon(id);
        this.$emit('deletemessage', UpdateMessage);
        setTimeout(function() {
            window.location.reload();
        }, 1000); 
      } catch (error) {
        const FailMessage = "Error updating subcon: " + error.errorMessage;
        this.$emit('deletefail-message', FailMessage);
      }
    }
  },
};
</script>

