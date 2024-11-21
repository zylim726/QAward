<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px">
        <md-card>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;margin-top: 10px;">
            <!-- Left Section (Back Button) -->
            <div>
              <a @click="backToComparison">
                <div class="tooltip">
                  <span class="tooltiptext" style="width: 160px; margin-left: -29px !important; margin-bottom: -105px;">
                    Back to comparison pages.
                  </span>
                  <md-icon class="mdIcon" style="margin-left: 17px !important;">arrow_back_ios</md-icon>
                </div>
              </a>
            </div>

            <!-- Right Section (Delete Button) -->
            <div v-if="getMaxQuotation <= 2">
              <a @click="deleteDescription()">
                <button type="button" class="btn-save" style="margin-right: 10px;">Delete</button>
              </a>
            </div>
          </div>
          <md-card-content style="margin-top: -28px;">
            <div v-if="isLoading"><loading-modal /><br><br></div>
            <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
            <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
            <br>
            <div class="table-container" style="margin-top: 10px !important;">
              <table class="nested-table" id="data-table">
                <thead>
                  <tr>
                    <th v-if="getMaxQuotation <= 2"></th>
                    <th colspan="6"></th>
                    <th v-for="(unitdata, index) in Unittype" :key="index" colspan="3" style="border: 1px solid #ddd;text-align: center;">{{ unitdata.cqUnitType.type }}</th>
                  </tr>
                  <tr>
                    <th v-if="getMaxQuotation <= 2"></th>
                    <th scope="col">Item</th>
                    <th scope="col">Element</th>
                    <th scope="col">Sub Element</th>
                    <th scope="col">Sub Sub Element</th>
                    <th scope="col">Description</th>
                    <th scope="col">Unit</th>
                    <th v-for="(header, index) in generatedHeaders" :key="'header-' + index" style="text-align: center; border-left: 1px solid #ddd !important; border-right: 1px solid #ddd !important;">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(formData, formIndex) in Description" :key="'form-' + formIndex">
                    <template v-if="formData.quotation.length <= 0 || parseFloat(formData.adj_quantity) === 0.00  ">
                      <td v-if="getMaxQuotation <= 2"> 
                        <input  
                          type="checkbox" 
                          :value="formData.id" 
                          :checked="selectedIds.includes(formData.id)" 
                          @change="toggleSelect(formData.id, $event.target.checked)"
                        />
                      </td>
                      <td v-if="getMaxQuotation <= 2" @click="editDescription(formData.id)" style="width:75px !important"><b>
                        {{ formIndex + 1}}
                        <md-icon style="font-size: 20px !important; margin-top: -5px; color: orange;">
                        edit_square
                        </md-icon>
                      </b></td>
                      <td v-else><b>
                        {{ formIndex + 1}}
                      </b></td>
                      <td><b>{{ formData.element || '' }}</b></td>
                      <td><b>{{ formData.sub_element || '' }}</b></td>
                      <td><b>{{ formData.description_sub_sub_element || '' }}</b></td>
                      <td class="td-max-width"><b>{{ formData.description_item }}</b></td>
                      <td><b>{{ formData.description_unit || '' }}</b></td>
                    </template>
                    <template v-else>
                      <td  v-if="getMaxQuotation <= 2">
                        <input 
                          type="checkbox" 
                          :value="formData.id" 
                          :checked="selectedIds.includes(formData.id)" 
                          @change="toggleSelect(formData.id, $event.target.checked)"
                        />
                      </td>
                      <td  v-if="getMaxQuotation <= 2" @click="editDescription(formData.id)" style="width:75px !important"><b>
                        {{ formIndex + 1}}
                        <md-icon style="font-size: 20px !important; margin-top: -5px; color: orange;">
                        edit_square
                        </md-icon>
                      </b></td>
                      <td v-else><b>
                        {{ formIndex + 1}}
                      </b></td>

                      <td>{{ formData.element || '' }}</td>
                      <td>{{ formData.sub_element || '' }}</td>
                      <td>{{ formData.description_sub_sub_element || '' }}</td>
                      <td class="td-max-width">{{ formData.description_item }}</td>
                      <td>{{ formData.description_unit || '' }}</td>
                      <template v-for="(unitdata, index) in formData.cqUnitType">
                        <td v-if="getMaxQuotation <= 2" :key="'bq-quantity-' + formIndex + '-' + index">
                          <input 
                            style="width: 100px;"
                            type="number" 
                            :value="unitdata.bq_quantity || 0" 
                            @input="updateBqQuantity(formIndex, index, $event.target.value)" 
                            :min="0" 
                            @keydown="blockNegativeInput">
                        </td>
                        <td v-else :key="'bq-quantity-' + formIndex + '-' + index" style="border-left: 1px solid #ddd;">
                          {{ unitdata.bq_quantity || 0 }}</td>
                        
                        <td :key="'adj-quantity-' + formIndex + '-' + index">
                          <input 
                            style="width: 100px;"
                            type="number" 
                            :value="unitdata.adj_quantity || 0" 
                            @input="updateAdjQuantity(formIndex, index, $event.target.value)" 
                            :min="0" 
                            @keydown="blockNegativeInput">
                        </td>
                        <td :key="'remeasurement-quantity-' + formIndex + '-' + index" style="border-right: 1px solid #ddd;">
                          <input 
                            style="width: 100px;"
                            type="number" 
                            :value="unitdata.remeasurement_quantity || 0" 
                            @input="updateRemeasurementQuantity(formIndex, index, $event.target.value)" 
                            :min="0" 
                            @keydown="blockNegativeInput">
                        </td>
                      </template>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
            <br>
            <button type="submit" class="btn-save" @click="saveAllData">Submit</button>
            <br>
          </md-card-content>
          <br>
        </md-card>
        <br>
      </div>
    </div>
    <EditDescription :edit-modal="editModal"  @editMessage="EditMessage" @editfail-message="EditErrorMessage"  @close="closeEditModal" :id="editId" title="Edit Description"></EditDescription>
    <DeleteDescription :show-modal="showModal"  @close="closeModal" :id="deleteId" @message="Message" @fail-message="ErrorMessage"  title="Delete Comparison Summary"></DeleteDescription>
  </div>
</template>


<script>
import DescriptionController from "@/services/controllers/DescriptionController.js";
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";
import EditDescription from "@/components/Pop-Up-Modal/EditDescription.vue";
import DeleteDescription from "@/components/Pop-Up-Modal/DeleteDescription.vue";


export default {
  components: {
    LoadingModal,
    EditDescription,
    DeleteDescription
  },
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
      getMaxQuotation: 0,
      Unittype: [],
      Description: [],
      RateInput: {}, 
      editModal: false,
      showModal: false,
      editId: null,
      deleteId: [],
      isLoading: false,
      selectedIds: [],
    };
  },
  computed: {
    generatedHeaders() {
      const headers = [];
      for (let i = 0; i < this.Unittype.length; i++) {
        headers.push('BQ Quantity', 'ADJ Quantity', 'Remeasurement Quantity');
      }
      return headers;
    },
  },
  mounted() {
    const id = this.$route.query.cqId;
    this.getNewDescription(id);
  },
  methods: {
     backToComparison() {
      const id = this.$route.query.cqId;
      const storedProjectId = localStorage.getItem('projectId');
      this.$router.push({
        path: '/comparison',
        query: { cqID: id, projectID: storedProjectId }
      });
    },
    EditMessage(message) {
      this.UpdateMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    EditErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    Message(message) {
      this.UpdateMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    ErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    editDescription(id) {
      this.editId = id;
      this.editModal = true;
    },
    closeEditModal() {
      this.editModal = false;
    },
    toggleSelect(id, isChecked) {
      if (isChecked) {
        // Add the ID to selectedIds if checked
        if (!this.selectedIds.includes(id)) {
          this.selectedIds.push(id);
        }
      } else {
        // Remove the ID from selectedIds if unchecked
        this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
      }
    },
    deleteDescription() {
      const multipleCheck = this.selectedIds; 
      if (multipleCheck.length === 0) {
        this.FailMessage = "Please select at least one item to delete.";
        setTimeout(() => {
        this.FailMessage = '';
      }, 2000);
        return;
      }

      this.deleteId = multipleCheck;
      this.showModal = true; 
    },
    closeModal() {
      this.showModal = false;
    },
    async getNewDescription(id) {
      try {
        this.isLoading = true;
        const processedData = await DescriptionController.getNewDescription(id);
        this.Description = processedData;
        const maxQuotationLength = Math.max(...processedData.map(item => item.quotation.length));
        
         
        const isRemeasurementQuantityValid = 
        this.Description[0]?.remeasurement_quantity !== undefined ||
        !isNaN(Number(this.Description[0]?.remeasurement_quantity)) || 
        Number(this.Description[0]?.remeasurement_quantity) !== 0.00;

        // Define getMaxQuotationLength based on the condition
        const getMaxQuotationLength = isRemeasurementQuantityValid ? maxQuotationLength - 1 : maxQuotationLength;

        this.getMaxQuotation = getMaxQuotationLength;
  
        if (processedData.length > 0) {
          this.Unittype = processedData[0].cqUnitType;
        }
      } catch (error) {
        this.FailMessage = 'Error fetching Description:', error;
      } finally {
        this.isLoading = false;
      }
    },
    async saveAllData() {
      try {
        this.isLoading = true;
        window.scrollTo(0, 0);
        const dataToSave = this.Description.flatMap(formData => {
          return formData.cqUnitType.map(item => {
            const cqId = this.$route.query.cqId;
            const cqUnitTypeId = item.id;
            const adj_quantity = item.adj_quantity || 0;
            const bq_quantity = item.bq_quantity || 0;
            const remeasurement_quantity = item.remeasurement_quantity || 0;
            return { cqId, cqUnitTypeId, adj_quantity, bq_quantity, remeasurement_quantity };
          });
        });

        const SuccessMessage = await DescriptionController.editQuantity(dataToSave);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.UpdateMessage = Message;
        const storedProjectId = localStorage.getItem('projectId');
        window.scrollTo(0, 0);
        this.$router.push({ name: 'Subcon Comparison', query: { cqID: this.$route.query.cqId,projectID: storedProjectId  } }); 
        
      } catch (error) {
        window.scrollTo(0, 0);
        this.FailMessage = ("Failed to save data.",error.message);
      } finally {
        this.isLoading = false;
      }
    },
    blockNegativeInput(event) {
      if (event.key === '-' || event.key === 'Minus') {
        event.preventDefault();
      }
    },
    updateAdjQuantity(formIndex, index, value) {
      this.Description[formIndex].cqUnitType[index].adj_quantity = parseFloat(value) || 0;
    },
    updateBqQuantity(formIndex, index, value) {
      this.Description[formIndex].cqUnitType[index].bq_quantity = parseFloat(value) || 0;
    },
    updateRemeasurementQuantity(formIndex, index, value) {
      this.Description[formIndex].cqUnitType[index].remeasurement_quantity = parseFloat(value) || 0;
    }
  },
};
</script>

