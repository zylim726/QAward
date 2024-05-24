<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content" style="width: 35%;max-height: 110vh !important;">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <input
          type="text"
          v-model="code"
          placeholder="Code"
          class="typeInput"
          @focus="onInputFocus('code')"
        />
        <input
          type="text"
          v-model="name"
          placeholder="Name"
          class="typeInput"
          @focus="onInputFocus('name')"
        />
        <input
          type="text"
          v-model="reg_no"
          placeholder="Reg No"
          class="typeInput"
          @focus="onInputFocus('reg_no')"
        />
        <input
          type="text"
          v-model="area"
          placeholder="Area"
          class="typeInput"
          @focus="onInputFocus('area')"
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
import ProjectController from "@/services/controllers/ProjectController.js";
export default {
  props: {
    showModal: Boolean,
    title: String,
  },
  data() {
    return {
      name: "",
      regno: "",
      code: "",
      area: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.name = "";
      this.regno ="";
      this.code ="";
      this.area ="";
    },
    saveAndCloseModal() {
      const projectData = {
        name: this.name,
        regno: this.regno,
        code: this.code,
        area: this.area,
      };
      this.addProjecttoserver(projectData);
      this.closeModal();
    },

    onInputFocus(input) {},
    async addProjecttoserver(projectData) {
      try {
        const UpdateMessage = await ProjectController.addProject(projectData);
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

