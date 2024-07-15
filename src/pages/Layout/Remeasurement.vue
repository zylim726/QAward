<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px">
        <md-card>
          <md-card-content>
            <div class="table-container" style="margin-top: 10px !important;">
              <table class="nested-table" id="data-table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Element</th>
                    <th scope="col">Sub Element</th>
                    <th scope="col">Sub Sub Element</th>
                    <th scope="col">Description</th>
                    <th scope="col">Unit</th>
                    <th scope="col">(ADJ) QTY</th>
                    <th>Remeasurement QTY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(formData, formIndex) in Description" :key="'form-'+formIndex">
                    <template v-if="formData.quotation.length <= 0 || formData.quotation[0].total_quote_amount === 0">
                      <td><b>{{ formIndex + 1 }}</b></td>
                      <td><b>{{ formData.element || '' }}</b></td>
                      <td><b>{{ formData.sub_element || '' }}</b></td>
                      <td><b>{{ formData.description_sub_sub_element || '' }}</b></td>
                      <td  class="td-max-width"><b>{{ formData.description_item }}</b></td>
                      <td><b>{{ formData.description_unit || '' }}</b></td>
                    </template>
                    <template v-else>
                      <td>{{ formIndex + 1 }}</td>
                      <td>{{ formData.element || '' }}</td>
                      <td>{{ formData.sub_element || '' }}</td>
                      <td>{{ formData.description_sub_sub_element || '' }}</td>
                      <td  class="td-max-width" style="padding-left: 60px !important;">{{ formData.description_item }}</td>
                      <td>{{ formData.description_unit || '' }}</td>
                      <td><input type="number" v-model.number="formData.adj_quantity"></td>
                      <td><input type="number" v-model.number="formData.remeasurement_quantity"></td>
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
  </div>
</template>

<script>
import DescriptionController from "@/services/controllers/DescriptionController.js";

export default {
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
      Unittype: [],
      Description: [],
      RateInput: {}, 
    };
  },
  mounted() {
    const id = this.$route.query.cqId;
    this.getNewDescription(id);
  },
  methods: {
    async getNewDescription(id) {
      try {
        const processedData = await DescriptionController.getNewDescription(id);
        this.Description = processedData;
        processedData.forEach((formData) => {
           console.log('formdata',formData);
          const cqUnitType = formData.cqUnitType;
          this.Unittype = cqUnitType;
        });
      } catch (error) {
        console.error('Error fetching Description:', error);
        throw error;
      }
    },
    async saveAllData() {
      console.log('Button clicked');
      try {
        const dataToSave = this.Description.map(formData => {
      
          const descriptionId = formData.id;
          const adj_quantity = formData.adj_quantity !== undefined ? formData.adj_quantity : 0; 
          const remeasurement_quantity = formData.remeasurement_quantity !== undefined ? formData.remeasurement_quantity : 0;

          return { descriptionId, adj_quantity, remeasurement_quantity };
        }).filter(data => data !== null);

        console.log('Data to save:', dataToSave); 
        const SuccessMessage = await DescriptionController.editQuantity(dataToSave);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.UpdateMessage = Message;
        this.$router.push({ name: 'Subcon Comparison', query: { cqID: this.$route.query.cqId } }); // use actual route name and pass the query parameter

      } catch (error) {
        this.FailMessage = "Failed to save data.";
      }
    },
  },
};
</script>

