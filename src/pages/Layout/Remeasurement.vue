<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px">
        <md-card>
          <md-card-content>
            <div v-if="isLoading"><loading-modal /><br><br></div>
            <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
            <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
            <br>
            <div class="table-container" style="margin-top: 10px !important;">
              <table class="nested-table" id="data-table">
                <thead>
                  <tr>
                    <th colspan="6"></th>
                    <th v-for="(unitdata, index) in Unittype" :key="index" colspan="3" style="border: 1px solid #ddd;text-align: center;">{{ unitdata.cqUnitType.type }}</th>
                  </tr>
                  <tr>
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
                    <template v-if="formData.quotation.length <= 0 || (parseFloat(formData.adj_quantity) === 0.00 || formData.description_unit.trim() === '')  ">
                      <td @click="editDescription(formData.id)" style="width:75px !important"><b>
                        {{ formIndex + 1}}
                        <md-icon style="font-size: 20px !important; margin-top: -5px; color: orange;">
                        edit_square
                        </md-icon>
                      </b></td>
                      <td><b>{{ formData.element || '' }}</b></td>
                      <td><b>{{ formData.sub_element || '' }}</b></td>
                      <td><b>{{ formData.description_sub_sub_element || '' }}</b></td>
                      <td class="td-max-width"><b>{{ formData.description_item }}</b></td>
                      <td><b>{{ formData.description_unit || '' }}</b></td>
                    </template>
                    <template v-else>
                      <td  @click="editDescription(formData.id)" >
                        {{ formIndex + 1}}
                        <md-icon style="font-size: 20px !important; margin-top: -5px; color: orange;">
                        edit_square
                        </md-icon>
                      </td>
                      <td>{{ formData.element || '' }}</td>
                      <td>{{ formData.sub_element || '' }}</td>
                      <td>{{ formData.description_sub_sub_element || '' }}</td>
                      <td class="td-max-width">{{ formData.description_item }}</td>
                      <td>{{ formData.description_unit || '' }}</td>
                      <template v-for="(unitdata, index) in formData.cqUnitType">
                        <td :key="'bq-quantity-' + formIndex + '-' + index" style="border-left: 1px solid #ddd;">
                          {{ unitdata.bq_quantity || 0 }}
                        </td>
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
    <EditDescription :edit-modal="editModal" @close="closeEditModal" :id="editId" title="Edit Description"></EditDescription>

  </div>
</template>


<script>
import DescriptionController from "@/services/controllers/DescriptionController.js";
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";
import EditDescription from "@/components/Pop-Up-Modal/EditDescription.vue";


export default {
  components: {
    LoadingModal,
    EditDescription
  },
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
      Unittype: [],
      Description: [],
      RateInput: {}, 
      editModal: false,
      editId: null,
      isLoading: false,
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
    editDescription(id) {
      this.editId = id;
      this.editModal = true;
    },
    closeEditModal() {
      this.editModal = false;
    },
    async getNewDescription(id) {
      try {
        this.isLoading = true;
        const processedData = await DescriptionController.getNewDescription(id);
        this.Description = processedData;
        console.log('formDescrption',this.Description);
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
        const dataToSave = this.Description.flatMap(formData => {
          return formData.cqUnitType.map(item => {
            const cqId = this.$route.query.cqId;
            const cqUnitTypeId = item.id;
            const adj_quantity = item.adj_quantity || 0;
            const remeasurement_quantity = item.remeasurement_quantity || 0;
            return { cqId, cqUnitTypeId, adj_quantity, remeasurement_quantity };
          });
        });

        const SuccessMessage = await DescriptionController.editQuantity(dataToSave);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.UpdateMessage = Message;
        const storedProjectId = localStorage.getItem('projectId');
        this.$router.push({ name: 'Subcon Comparison', query: { cqID: this.$route.query.cqId,projectID: storedProjectId  } }); 
        
      } catch (error) {
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
    updateRemeasurementQuantity(formIndex, index, value) {
      this.Description[formIndex].cqUnitType[index].remeasurement_quantity = parseFloat(value) || 0;
    }
  },
};
</script>

