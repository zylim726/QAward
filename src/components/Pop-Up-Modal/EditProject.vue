<template>
  <div class="modal" :class="{ 'is-active': editProject }">
    <div class="modal-background" @click="closeeditProj"></div>
    <div class="modal-content" style="width: 35%; max-height: 93vh !important;">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />

        <!-- Project Information Inputs -->
        <div class="form-row">
          <!-- Column 1 -->
          <div class="form-group" style="width: 50%;margin-right: 10px;">
            <label>Code :</label>
            <input
              type="text"
              v-model="processedData.code"
              placeholder="Code"
              class="typeInput"
            />
          </div>
          <!-- Column 2 -->
          <div class="form-group" style="width: 50%;">
            <label>Name :</label>
            <input
              type="text"
              v-model="processedData.name"
              placeholder="Name"
              class="typeInput"
            />
          </div>
        </div>

        <div class="form-row">
          <!-- Column 1 -->
          <div class="form-group" style="width: 50%;margin-right: 10px;">
            <label>Area :</label>
            <input
              type="text"
              v-model="processedData.area"
              placeholder="Area"
              class="typeInput"
            />
          </div>
          <!-- Column 2 -->
          <div class="form-group" style="width: 50%;">
            <label>Reg No :</label>
            <input
              type="text"
              v-model="processedData.regno"
              placeholder="Reg No"
              class="typeInput"
            />
          </div>
        </div>

        <!-- Unit Type Inputs -->
        <div v-if="unitTypes.length > 0">
          <div class="form-group" v-for="(unitType, index) in unitTypes" :key="index">
            <p>Unit Type :</p>
            <input
              type="text"
              v-model="unitType.unit_type"
              placeholder="Unit Type"
              class="typeInput"
              @focus="onInputFocus('unit_type')"
            />
            <p>Quantity :</p>
            <input
              type="text"
              v-model="unitType.quantity"
              placeholder="Quantity"
              class="typeInput"
              @focus="onInputFocus('quantity')"
            />
            <p>ADJ Factor :</p>
            <input
              type="text"
              v-model="unitType.adj_factor"
              placeholder="ADJ Factor"
              class="typeInput"
              @focus="onInputFocus('adj_factor')"
            />
          </div>
        </div>
        <div v-else>
          <p>No unit types found.</p>
        </div>

        <!-- Buttons -->
        <div class="form-group">
          <button class="btn-save" aria-label="close" @click.stop="closeeditProj">Close</button>
          <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal()">Save</button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import ProjectController from "@/services/controllers/ProjectController.js";

export default {
  props: {
    editProject: Boolean,
    title: String,
    id: Number,
  },
  data() {
    return {
      processedData: null,
      unitTypes: [],
    };
  },
  watch: {
    id(newVal) {
      if (newVal !== null) {
        this.getDetailProject(newVal);
        this.getUnitTypes(newVal);
      }
    }
  },
  methods: {
    closeeditProj() {
      this.$emit("close");
    },
    saveAndCloseModal() {
      const updatedData = { ...this.processedData, unitTypes: this.unitTypes };
      this.editProjs(updatedData.id, updatedData); 
   //   this.closeeditProj();
    },
    async getDetailProject(id) {
      try {
        this.processedData = await ProjectController.getDetailProject(id);
      } catch (error) {
        const FailMessage = "Error fetching project details: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    async getUnitTypes(id) {
      try {
        this.unitTypes = await ProjectController.getUnitTypes(id);
      } catch (error) {
        const FailMessage = "Error fetching unit types: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    async editProjs(id, updatedData) {
      try {
        const updateMessage = await ProjectController.editProjs(id, updatedData);
        this.$emit('editMessage', updateMessage);
        setTimeout(() => {
          window.location.reload();
        }, 1000); 
      } catch (error) {
        const FailMessage = "Error updating project: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
  },
};
</script>