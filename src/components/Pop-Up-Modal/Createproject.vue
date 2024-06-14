<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content" style="width: 35%; max-height: 93vh !important;">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <label><b>Project Setup : </b></label>
        <input
          type="text"
          v-model="code"
          placeholder="Code"
          class="typeInput"
        />
        <input
          type="text"
          v-model="name"
          placeholder="Name"
          class="typeInput"
        />
        <input
          type="text"
          v-model="reg_no"
          placeholder="Reg No"
          class="typeInput"
        />
        <input
          type="text"
          v-model="area"
          placeholder="Area"
          class="typeInput"
        />
        <br /><br />
        <label><b>Unit Type : </b></label>
        <button class="btn-save" style="height: 25px;margin-top: -26px !important;margin-right: 0px !important;" 
          @click="addUnitType">Add Unit Type</button>
        <div v-for="(unitType, index) in unitTypes" :key="index" class="unitTypeGroup" style="margin-top: 10px;">
          <input
            type="text"
            v-model="unitType.unit_type"
            placeholder="Unit Type"
            class="typeInput"
          />
          <input
            type="text"
            v-model="unitType.quantity"
            placeholder="Quantity"
            class="typeInput"
          />
          <input
            type="text"
            v-model="unitType.adj_factor"
            placeholder="ADJ Factor"
            class="typeInput"
          />
        </div>
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
      unitTypes: [
        { unit_type: "", quantity: "", adj_factor: "" }
      ],
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.name = "";
      this.regno = "";
      this.code = "";
      this.area = "";
      this.unitTypes = [{ unit_type: "", quantity: "", adj_factor: "" }];
    },
    saveAndCloseModal() {
      const projectData = {
        name: this.name,
        regno: this.regno,
        code: this.code,
        area: this.area,
        unitTypes: this.unitTypes
          .filter(unitType => unitType.unit_type && unitType.quantity && unitType.adj_factor)
          .map(unitType => ({
            unit_type: unitType.unit_type,
            quantity: unitType.quantity,
            adj_factor: unitType.adj_factor,
          })),
      };
      this.addProjectToServer(projectData);
      this.closeModal();
    },
    async addProjectToServer(projectData) {
      try {
        const SuccessMessage = await ProjectController.addProject(projectData);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.$emit('message', Message);
        setTimeout(function() {
          window.location.reload();
        }, 500);
      } catch (error) {
        const FailMessage = "Error updating project: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    addUnitType() {
      this.unitTypes.push({ unit_type: "", quantity: "", adj_factor: "" });
    },
  },
};
</script>

<style>
.unitTypeGroup {
  margin-bottom: 10px;
}
</style>
