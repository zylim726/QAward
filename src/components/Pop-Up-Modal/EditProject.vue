<template>
  <div class="modal" :class="{ 'is-active': editProject }">
    <div class="modal-background" @click="closeeditProj"></div>
    <div class="modal-content" style="width: 35%; overflow-y: auto; max-height: 95% !important;">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />

        <div v-if="FailMessage" class="error-message" style="color: red; font-size: 15px; margin-bottom: 10px;">
          {{ FailMessage }}
        </div>

        <div v-if="isLoading"><loading-modal /><br><br></div>

        <div v-if="!isLoading && unitTypes.length > 0">
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
                  required
                />
              </div>
              <div class="input-group">
                <label style="text-align: left;" for="adjFactorInput">Adj Factor : </label>
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
        <div v-if="!isLoading && unitTypes.length === 0" style="margin-bottom: 350px;">
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
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";
export default {
  components:{LoadingModal},
  props: {
    editProject: Boolean,
    title: String,
    id: Number,
  },
  data() {
    return {
      processedData: null,
      unitTypes: [],
      isLoading: false, 
      FailMessage: '',
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
      let isValid = true;
      
      this.unitTypes.forEach((unitType) => {
        if (!unitType.unit_type || unitType.unit_type.trim() === '') {
          isValid = false;
        }
        if (unitType.adj_factor == 0 || unitType.adj_factor === '') {
          isValid = false;
        }
        if (unitType.quantity == 0 || unitType.quantity === '') {
          isValid = false;
        }
      });

      if (!isValid) {

        this.FailMessage = "Error: Unit type is required. Quantity and Adj Factor cannot be zero or empty. Please correct the values.";

        Vue.nextTick(() => {
          const modalContent = document.querySelector('.modal-content');
          modalContent.scrollTop = 0; 
        });

        setTimeout(() => {
          this.FailMessage = null;
        }, 3000); 
        return; 

      }else {
        const updatedData = { unitTypes: this.unitTypes };

        this.isLoading = true;
        try {
          await this.editProjs(this.id, updatedData);
        } finally {
          this.isLoading = false; // Reset loading state
        }
      }
    },
    async getUnitTypes(id) {
      this.isLoading = true; 
      try {
        this.unitTypes = await ProjectController.getUnitTypes(id);
      } catch (error) {
        const FailMessage = "Error fetching unit types: " + error.errorMessage;
        this.$emit('editfail-message', FailMessage);
      } finally {
        this.isLoading = false; 
      }
    },
    async editProjs(id, updatedData) {
      this.isLoading = true; 
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
        this.$emit('editfail-message', FailMessage);
      } finally {
        this.isLoading = false; 
      }
    },
    addUnitType() {
      this.unitTypes.push({
        unit_type: '',
        adj_factor: '1',
        quantity: ''
      });
    },
    async deleteUnitType(index, id) {
      if (id) {
        try {
          await ProjectController.removeProject(id);
        } catch (error) {
          const FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
          this.$emit('editfail-message', FailMessage);
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
      if (isNaN(adj_factor) || adj_factor === '' || adj_factor < 0) {
        this.unitTypes[index].adj_factor = 1.00; 
      }
    }
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
