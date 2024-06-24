<template>
  <div class="modal" :class="{ 'is-active': editProject }">
    <div class="modal-background" @click="closeeditProj"></div>
    <div class="modal-content" style="width: 30%; overflow-y: auto;">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />

        <div v-if="unitTypes.length > 0">
          <div class="form-group" v-for="(unitType, index) in unitTypes" :key="index" style="margin-bottom: 50px;">
            <div class="input-pair">
              <div class="input-group">
                <label for="unitTypeInput">Unit Type :</label>
                <input
                  type="text"
                  id="unitTypeInput"
                  v-model="unitType.unit_type"
                  placeholder="Enter Unit Type"
                  class="typeInput"
                />
              </div>
              <div class="input-group">
                <label for="adjFactorInput">Adj Factor :</label>
                <input
                  type="number"
                  id="adjFactorInput"
                  v-model="unitType.adj_factor"
                  placeholder="Enter Adj Factor"
                  class="typeInput"
                  min="0.5"
                  step="0.01"
                  @input="validateAdjFactor(index)"
                />
              </div>
            </div>
            <div class="input-pair">
              <div class="input-group">
                <label for="quantityInput">Quantity :</label>
                <input
                  type="number"
                  id="quantityInput"
                  v-model="unitType.quantity"
                  placeholder="Enter Quantity"
                  class="typeInput"
                  min="0"
                  @input="validateQuantity(index)"
                />
              </div>
              <button class="transparentButton" aria-label="delete" @click.stop="deleteUnitType(unitType.id)">
                <div class="tooltip">
                  <span class="tooltiptext">Delete Unit Type</span>
                  <md-icon style="color: orange;">delete</md-icon>
                </div>
              </button>
            </div>
            
          </div>
        </div>
        <div v-else>
          <p>No unit types found.</p>
        </div>
        
        <!-- Buttons -->
        <div class="form-group">
          <button class="btn-save" aria-label="close" @click.stop="closeeditProj">Close</button>
          <button class="btn-save" aria-label="save" @click.stop="saveAndCloseModal()">Save</button>
          <button class="btn-save" aria-label="add" @click.stop="addUnitType()">Add Unit Type</button>
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
        this.getUnitTypes(newVal);
      }
    }
  },
  methods: {
    closeeditProj() {
      this.$emit("close");
    },
    async saveAndCloseModal() {
      const updatedData = { unitTypes: this.unitTypes };
      await this.editProjs(this.id, updatedData); 
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
        const SuccessMessage = await ProjectController.editProjs(id, updatedData);
        this.$emit("close");
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.$emit('editMessage', Message);
        setTimeout(() => {
          window.location.reload(); 
        }, 1000); 
      } catch (error) {
        const FailMessage = "Error updating project: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    addUnitType() {
      this.unitTypes.push({
        unit_type: '',
        adj_factor: '',
        quantity: ''
      });
    },
    async deleteUnitType(id) {
      try {
        await ProjectController.removeProject(id);
        const index = this.unitTypes.findIndex(unitType => unitType.id === id);
        if (index !== -1) {
          this.unitTypes.splice(index, 1);
        }
      } catch (error) {
        const FailMessage = "Error deleting unit type: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    validateQuantity(index) {
      let quantity = parseFloat(this.unitTypes[index].quantity);
      if (isNaN(quantity) || quantity < 0) {
        this.unitTypes[index].quantity = 0; 
      }
    },
    validateAdjFactor(index) {
      let adj_factor = parseFloat(this.unitTypes[index].adj_factor);
      if (isNaN(adj_factor) || adj_factor < 0) {
        this.unitTypes[index].adj_factor = 0; 
      }
    },
  },
};
</script>

<style>
.input-pair {
  display: flex;
  margin-bottom: 10px;
}

.input-group {
  flex: 1;
  margin-right: 10px;
}

.typeInput {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
