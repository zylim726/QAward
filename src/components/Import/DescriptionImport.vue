<template>
  <div>
    <label
      for="desciptionInput"
      style="margin-right: 10px; float: right"
      class="file-label"
    >
      <md-icon class="mdIcon">upload_file</md-icon>
      <!-- Set multiple attribute to enable multiple file selection -->
      <input id="desciptionInput" type="file" multiple @change="DescriptionUpload" />
    </label>
    <button @click="exportTableHeaders" class="transparentButton" style="margin-right: 10px; float: right">
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
            <th scope="col">Element</th>
            <th scope="col">Sub Element</th>
            <th scope="col">Sub Sub Element</th>
            <th scope="col">Description </th>
            <th scope="col">Unit </th>
            <th scope="col" v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.type }}</th>
            <th scope="col">Budget Rate </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in importedData"
            :key="index"
            :class="{ 'selected-row': row.selected }"
          >
            <!-- Modified to conditionally display the checkbox -->
            <td v-if="shouldDisplayCheckbox(row)">
              <label class="control control--checkbox">
                <input type="checkbox" v-model="row.selected" />
              </label>
            </td>
            <td v-else></td>
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
import DescriptionController from "@/services/controllers/DescriptionController.js";

export default {
  props: {
    cqId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      importedData: [],
      Unittype: [],
      columnTitles: [],
      selectAll: false,
    };
  },
  computed: {
    filteredColumns() {
      return this.columnTitles.filter((title) => !this.isBooleanColumn(title));
    },
  },
  watch: {
    cqId(newValue, oldValue) {
      this.getUnittype(newValue);
    }
  },
  methods: {
    async getUnittype(id) {
      try {
        const processedData = await CallofQuotationController.getUnittype(id);
        this.Unittype = processedData;
      } catch (error) {
        const FailMessage = 'Error fetching Unittype:'+ error;
        this.$emit('fail-message', FailMessage);
      }
    },
    DescriptionUpload(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        Import.parse(file, {
          complete: (result) => {
            this.importData(result.data);
          },
          header: true,
        });
      }
    },
    importData(data) {
      this.importedData = [...this.importedData, ...data];
      this.columnTitles = Object.keys(this.importedData[0]);
    },
    selectAllRows() {
      if (this.importedData.length > 0) {
        this.importedData.forEach((row) => {
          row.selected = this.selectAll;
        });
      }
    },
    shouldDisplayCheckbox(row) {
     return true;
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
    exportTableHeaders() {
      try {
        const headers = []; 
        const thElements = document.querySelectorAll('thead th');

        thElements.forEach((th) => {
          // Exclude the checkbox column
          if (th.textContent.trim() !== "") {
            headers.push(th.textContent.trim());
          }
        });

        const headersCSV = headers.join(',');

        const csvContent = "data:text/csv;charset=utf-8," + headersCSV;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "description_template.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        link.remove();
      } catch (error) {
        const FailMessage = "Error exporting table headers:"+ error;
        this.$emit('fail-message', FailMessage);
      }
    },
    async saveData() {
      const cqId = this.cqId;
      const selectImportData = this.importedData.filter(importedRow => importedRow.selected);
      const unittype = this.Unittype;
      
      const matchedData = selectImportData.map(object => {
        const matchedValues = {};
        unittype.forEach(unit => {
          if (object.hasOwnProperty(unit.type)) {
            matchedValues[unit.id] = object[unit.type];
          }
        });


        const hasMatches = Object.keys(matchedValues).length > 0;

        return hasMatches ? {
            matchedValues,
            element: object["Element"],
            sub_element: object["Sub Element"],
            description_sub_sub_element: object["Sub Sub Element"],
            description_unit: object["Unit"],
            description: object["Description"],
            budget: object["Budget Rate"],
        } : null;
      }).filter(data => data !== null);

      try {
        const SuccessMessage = await DescriptionController.addDescription(cqId,matchedData);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.$emit('message', Message);
        
        // Remove elements from selectImportData
        selectImportData.forEach(importedRow => {
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
