<template>
  <div>
    <label
      for="fileInput"
      style="margin-right: 10px; float: right"
      class="file-label"
    >
      <md-icon class="mdIcon">upload_file</md-icon>
      <input id="fileInput" type="file" @change="projectUpload" />
    </label>
    <button
      @click="downloadExcelTemplate"
      class="transparentButton"
      style="margin-right: 10px; float: right"
    >
      <md-icon class="mdIcon">download_for_offline</md-icon>
    </button>
   


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
          <tr v-for="(formData, index) in formDataList" :key="index" :class="{ 'selected-row': formData.selected }">
            <td><input type="checkbox" v-model="formData.selected"></td>
            <td>{{ formData.tradeCategory }}</td>
            <td>{{ formData.trade }}</td>
            <td>{{ formData.location }}</td>
            <td>{{ formData.budgetAmount }}</td>
            <td>{{ formData.callingquotationDate }}</td>
            <td>{{ formData.awadingtaget }}</td>
            <td>{{ formData.remarks }}</td>
          </tr>
          <tr
            v-for="(row, index) in importedData"
            :key="index"
            :class="{ 'selected-row': row.selected }"
          >
            <td>
              <label class="control control--checkbox">
                <input type="checkbox" v-model="row.selected" />
              </label>
            </td>
            <td v-for="column in filteredColumns" :key="column">
              {{ displayValue(row[column], column) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button type="submit" class="btn-save" @click="saveData" >Save</button><br /><br />
  </div>
</template>
<script>
import Import from "papaparse";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";
import csvLaData from "@/assets/template/la-template.js";

export default {
  props: {
    formDataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      importedData: [],
      columnTitles: [],
      selectAll: false
    };
  },
  computed: {
    filteredColumns() {
      return this.columnTitles.filter((title) => !this.isBooleanColumn(title));
    },
  },
  methods: {
    projectUpload(event) {
      const file = event.target.files[0];
      Import.parse(file, {
        complete: (result) => {
          this.importData(result.data);
        },
        header: true,
      });
    },
    importData(data) {
      this.importedData = this.importedData.concat(data);
      this.columnTitles = Object.keys(this.importedData[0]);
    },
    selectAllRows() {
      this.importedData.forEach((row) => {
        row.selected = this.selectAll;
      });
      this.formDataList.forEach((formData) => {
        formData.selected = this.selectAll;
      });
    },
    displayValue(value, key) {
      if (typeof value === "boolean") {
        return ""; 
      }
      return value; 
    },
    isBooleanColumn(key) {
      return this.importedData.some((row) => typeof row[key] === "boolean");
    },
    downloadExcelTemplate() {
    let csv = 'category,trade,location 1,AA Budget Amount,Actuall Calling Quotation Date,Awading Target Date,Remarks\n';

    csvLaData.forEach(function(row) {
        // Convert dates to desired format (e.g., YYYY-MM-DD)
        const formattedRow = row.map((value, index) => {
            // Check if the value is a date (assuming date values are in the 5th and 6th columns)
            if (index === 4 || index === 5) { // Adjust the indices based on the position of date columns
                const dateParts = value.split('/');
                // Reformat the date to YYYY-MM-DD format
                return `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
            } else {
                return value;
            }
        });
        csv += formattedRow.join(',');
        csv += '\n';
    });

    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';

    hiddenElement.download = 'La_template.csv';
    hiddenElement.click();
},
    async saveData() {
      const selectedFormData = this.formDataList.filter(formData => formData.selected);
      const selectedImportedData = this.importedData.filter(importedRow => importedRow.selected);

      const transformedCQImport = selectedImportedData.map(unit => ({
        tradeCategory: unit["category"],
        trade: unit["trade"],
        location: unit["location 1"],
        budgetAmount: unit["AA Budget Amount"],
        CallingQuotationDate: unit["Actuall Calling Quotation Date"],
        awadingtaget: unit["Awading Target Date"],
        remarks: unit["Remarks"],
      }));

      try {
        const Message = await CallofQuotationController.addCQ(selectedFormData, transformedCQImport);
        const UpdateMessage = Message[0]; 
        this.$emit('message', UpdateMessage);

        selectedFormData.forEach(formData => {
          const index = this.formDataList.indexOf(formData);
          if (index !== -1) {
            this.$emit('remove-item', index); 
          }
        });

        selectedImportedData.forEach(importedRow => {
          const index = this.importedData.indexOf(importedRow);
          if (index !== -1) {
            this.importedData.splice(index, 1);
          }
        });

        this.selectAll = false;

      } catch (error) {
        const FailMessage = "Error updating access permission: " + error.errorMessage;
        window.scrollTo(0, 0); 
        this.$emit('fail-message', FailMessage);
      }
    }
  },
};
</script>
