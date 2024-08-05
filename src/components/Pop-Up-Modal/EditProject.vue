<template>
  <div class="modal" :class="{ 'is-active': editProject }">
    <div class="modal-background" @click="closeeditProj"></div>
    <div class="modal-content" style="width: 35%; overflow-y: auto; max-height: 95% !important;">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />

        <div v-if="loading" class="spinner-border" role="status">
          <span class="visually-hidden">   
            <button class="transparentButton" style="margin-right: 10px;cursor: default;">
              <md-icon style="color: red;margin-bottom:10px;">autorenew</md-icon>
            </button> Loading...</span>
        </div>

        <div v-if="!loading && unitTypes.length > 0">
          <div class="form-group" v-for="(unitType, index) in unitTypes" :key="index" style="margin-bottom: 50px;">
            <div class="input-pair">
              <div class="input-group">
                <label style="text-align: left;" for="unitTypeInput">Unit Type :</label>
                <input
                  type="text"
                  id="unitTypeInput"
                  v-model="unitType.unit_type"
                  placeholder="Enter Unit Type"
                  class="typeInput"
                />
              </div>
              <div class="input-group">
                <label style="text-align: left;" for="adjFactorInput">Adj Factor :</label>
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
                <label style="text-align: left;" for="quantityInput">Quantity :</label>
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
              <button class="transparentButton" aria-label="delete" @click.stop="deleteUnitType(index, unitType.id)">
                <div class="tooltip">
                  <span class="tooltiptext">Delete Unit Type</span>
                  <md-icon style="color: orange;">delete</md-icon>
                </div>
              </button>
            </div>
            
          </div>
        </div>
        <div v-if="!loading && unitTypes.length === 0" style="margin-bottom: 350px;">
          <p>No unit types found.</p><br><br>
        </div>
        
        <!-- Buttons -->
        <div class="form-group">
          <button class="btn-save" aria-label="close" @click.stop="closeeditProj">Close</button>
          <button class="btn-save" aria-label="save" @click.stop="saveAndCloseModal()">Save</button>
          <button class="btn-save" aria-label="add" @click.stop="addUnitType()">Add Unit Type</button>
        </div>
        <br><br>
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
      loading: false, // Add loading state
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
      this.loading = true; // Set loading state
      const updatedData = { unitTypes: this.unitTypes };
      try {
        await this.editProjs(this.id, updatedData);
      } finally {
        this.loading = false; // Reset loading state
      }
    },
    async getUnitTypes(id) {
      this.loading = true; // Set loading state
      try {
        this.unitTypes = await ProjectController.getUnitTypes(id);
      } catch (error) {
        const FailMessage = "Error fetching unit types: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      } finally {
        this.loading = false; 
      }
    },
    async editProjs(id, updatedData) {
      this.loading = true; 
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
      } finally {
        this.loading = false; 
      }
    },
    addUnitType() {
      this.unitTypes.push({
        unit_type: '',
        adj_factor: '',
        quantity: ''
      });
    },
    async deleteUnitType(index, id) {
      if (id) {
        try {
          await ProjectController.removeProject(id);
        } catch (error) {
          const FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
          this.$emit('fail-message', FailMessage);
        }
      }
      this.unitTypes.splice(index, 1);
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
