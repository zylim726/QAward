<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content" style=" width: 25%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <input
          type="text"
          v-model="module"
          placeholder="module"
          class="typeInput"
          @focus="onInputFocus('Module')"
        />
        <input
          type="text"
          v-model="permission"
          placeholder="permission"
          class="typeInput"
          @focus="onInputFocus('Permission')"
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
import PermissionController from "@/services/controllers/PermissionController.js";
export default {
  props: {
    showModal: Boolean,
    title: String,
  },
  data() {
    return {
      module: "",
      permission: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.module = "";
      this.permission = "";
    },
    saveAndCloseModal() {
      this.addPermissionToServer(this.module, this.permission);
      this.closeModal();
    },
    onInputFocus(input) {},
    async addPermissionToServer(module, permission) {
      try {
        const UpdateMessage = await PermissionController.addPermission(module, permission);
        this.$emit('message', UpdateMessage);
        setTimeout(function() {
            window.location.reload();
        }, 500); 
      } catch (error) {
        const FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', FailMessage);
      }
    },
  },
};
</script>

