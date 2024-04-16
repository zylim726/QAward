<template>
  <div>
    <div class="projectTable-container">
      <table class="project-table">
        <thead>
          <tr>
            <th scope="col">
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="selectAllRows"
                />
              </label>
            </th>
            <th scope="col">Category</th>
            <th scope="col">Trade</th>
            <th scope="col">Location 1</th>
            <th scope="col">AA Budget Amount</th>
            <th scope="col">Actual Calling Quotation Date</th>
            <th scope="col">Awading Target Date</th>
            <th scope="col">Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(formData, index) in CallQuotation" :key="index" :class="{ 'selected-row': formData.selected }">
            <td><input type="checkbox" v-model="formData.selected"></td>
            <td>{{ formData.tradeCategory }}</td>
            <td>{{ formData.trade }}</td>
            <td>{{ formData.location }}</td>
            <td>{{ formData.budgetAmount }}</td>
            <td>{{ formData.CallingQuotationDate }}</td>
            <td>{{ formData.awadingtargetdate }}</td>
            <td>{{ formData.remarks }}</td>
          </tr>
        </tbody>
      </table>
    </div><br>
    <button type="submit" class="btn-save" @click="saveData" >Save</button><br /><br />
  </div>
</template>


<script>
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";
import {  Error } from "@/services";

export default {
  props: {
    Unittype: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      selectAll: false,
      CallQuotation: [],
    };
  },
  created() {
    this.getCQ();
  },
  methods: {
    selectAllRows() {
      this.$emit('select-all', this.selectAll);
    },
    async getCQ() {
      try {
        const processedData = await CallofQuotationController.getCQ();
        if (processedData.length > 0) {
          this.CallQuotation = processedData;
        } else {
          this.errorMessage = "An error occurred while fetching projects.";
        }

      } catch (error) {
        if (error.errorMessage === undefined) {
          this.errorMessage = "Error fetching data: " + Error.getMessage(504);
        } else {
          this.errorMessage = "Error fetching data: " + error.errorMessage;
        }
      }
    },
    async saveData() {
      try {
        const selectedFormData = this.CallQuotation.filter(formData => formData.selected);
        const ids = selectedFormData.map(formData => formData.id);
        const selectedUnit = this.Unittype;
        const UpdateMessage = await CallofQuotationController.addUnit(ids, selectedUnit);
        window.scrollTo(0, 0); 
        this.$emit('message', UpdateMessage);

        selectedFormData.forEach(formData => {
          const index = this.CallQuotation.indexOf(formData);
          if (index !== -1) {
            this.CallQuotation.splice(index, 1);
          }
        });
  
      } catch (error) {
        const FailMessage = "Error updating call for quotation: " + error.errorMessage;
        window.scrollTo(0, 0); 
        this.$emit('fail-message', FailMessage);
      }
    }
  },
};
</script>


