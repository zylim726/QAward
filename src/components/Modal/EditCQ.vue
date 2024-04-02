<template>
  <div class="modal" :class="{ 'is-active': editModal }">
    <div class="modal-background" @click="closeEditModal"></div>
    <div class="modal-content" style="height: 40%; width: 25%">
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
    </div>
    <button
      class="btn-save"
      aria-label="close"
      @click.stop="saveAndcloseEditModal"
      style="margin-top: 228px; margin-left: -164px"
    >
      Save
    </button>
    <button
      class="btn-save"
      aria-label="close"
      @click.stop="closeEditModal"
      style="margin-top: 228px"
    >
      Close
    </button>
  </div>
</template>

<script>
import PermissionController from "@/services/controllers/PermissionController.js";
export default {
  props: {
    editModal: Boolean,
    title: String,
  },
  data() {
    return {
      module: "",
      permission: "",
    };
  },
  mounted() {
    this.$emit('open');
  },
  methods: {
    closeEditModal() {
      this.$emit("close");
      this.module = "";
      this.permission = "";
    },
    saveAndcloseEditModal() {
      this.addPermissionToServer(this.module, this.permission);
      this.closeEditModal();
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
        const FailMessage = "Error updating access permission: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
  },
};
</script>

