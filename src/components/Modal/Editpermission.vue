<template>
  <div class="modal" :class="{ 'is-active': editModal }">
    <div class="modal-background" @click="closeEditModal"></div>
    <div class="modal-content" style="height: 40%; width: 25%">
      <div class="box">
        <h1 class="titleHeader">Edit Permission</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <input
          type="text"
          v-model="editedModule"
          placeholder="module"
          class="typeInput"
          @focus="onInputFocus('Module')"
        /><br>
        <input
          type="text"
          v-model="editedPermission"
          placeholder="permission"
          class="typeInput"
          @focus="onInputFocus('Permission')"
        />
      </div>
    </div>
    <button
      class="btn-save"
      aria-label="close"
      @click.stop="saveAndCloseEditModal"
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
    module: String,
    permission: String,
  },
  data() {
    return {
      editedModule: this.module,
      editedPermission: this.permission,
    };
  },
  mounted(){
    console.log('Edit Pages permission:', this.module);
    console.log('Edit Pages module:', this.permission);
  },
  methods: {
    closeEditModal() {
      this.$emit("close");
    },
    saveAndCloseEditModal() {
      this.addPermissionToServer(this.editedModule, this.editedPermission);
      this.closeEditModal();
    },
    onInputFocus(input) {},
    async addPermissionToServer(module, permission) {
      try {
        const UpdateMessage = await PermissionController.addPermission(module, permission);
        this.$emit('message', UpdateMessage);
        setTimeout(() => {
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
