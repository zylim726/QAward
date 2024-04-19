<template>
  <div>
    <md-card-content style="min-height: 235px; overflow-y: auto">
      <label
        for="unittypefileinput"
        style="margin-right: 10px; float: right"
        class="file-label"
      >
        <md-icon class="mdIcon">upload_file</md-icon>
        <input
          id="unittypefileinput"
          type="file"
          @change="unittypefileUpload"
        />
      </label>
      <button
        @click="downloadExcelTemplate"
        class="transparentButton"
        style="margin-right: 10px; float: right"
      >
        <md-icon class="mdIcon">download_for_offline</md-icon>
      </button>
      <div class="unittype-container">
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
              <th scope="col">Unit Type</th>
              <th scope="col">Unit Type Quantity</th>
              <th scope="col">ADJ Factor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(formDataUnit, index) in formDataUnitList" :key="index" :class="{ 'selected-row': formDataUnit.selected }">
              <td><input type="checkbox" v-model="formDataUnit.selected"></td>
              <td>{{ formDataUnit.name }}</td>
              <td>{{ formDataUnit.quantity }}</td>
              <td>{{ formDataUnit.adjFactor }}</td>
            </tr>
            <tr
              v-for="(unit, index) in importUnitlist"
              :key="index"
              :class="{ 'selected-row': unit.selected }"
            >
              <td>
                <label class="control control--checkbox">
                  <input type="checkbox" v-model="unit.selected" />
                </label>
              </td>
              <td v-for="column in filteredColumns" :key="column">
                {{ displayValue(unit[column], column) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div> </md-card-content
    ><br />
    <button type="submit" class="btn-save" @click="saveData" :disabled="isSaveButtonDisabled">Select the Call for Quotation</button><br /><br />
  </div>
</template>

<script>
import Import from "papaparse";
import csvUnitData from "@/assets/template/unittype-template.js";

export default {
  props: {
    formDataUnitList: {
      type: Array,
      default: () => []
    },
    selectedFormData: {
      type: Array,
      default: () => []
    },
    selectedImportedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      importUnitlist: [],
      columnTitles: [],
      selectAll: false,
    };
  },
  computed: {
    filteredColumns() {
      return this.columnTitles.filter((title) => !this.isBooleanColumn(title));
    },
    isSaveButtonDisabled() {
      return this.formDataUnitList.length === 0 && this.importUnitlist.length === 0;
    }
  },
  methods: {
    unittypefileUpload(event) {
      const file = event.target.files[0];
      Import.parse(file, {
        complete: (result) => {
          this.importData(result.data);
        },
        header: true,
      });
    },
    importData(data) {
      this.importUnitlist = this.importUnitlist.concat(data);
      this.columnTitles = Object.keys(this.importUnitlist[0]);
    },
    selectAllRows() {
      this.importUnitlist.forEach((unit) => {
        unit.selected = this.selectAll;
      });
      this.formDataUnitList.forEach((formDataUnit) => {
        formDataUnit.selected = this.selectAll;
      });
    },
    displayValue(value, key) {
      if (typeof value === "boolean") {
        return ""; 
      }
      return value; 
    },
    isBooleanColumn(key) {
      return this.importUnitlist.some((unit) => typeof unit[key] === "boolean");
    },
    downloadExcelTemplate() {

    let csv = 'Unit Type,Unit Type Quantity,ADJ Factor\n';

    csvUnitData.forEach(function(row) {
      csv += row.join(',');
      csv += '\n';
    });

    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';

    hiddenElement.download = 'Unittype_template.csv';
    hiddenElement.click();
    },
    async saveData() {
      const selectedFormData = this.formDataUnitList.filter(formDataUnit => formDataUnit.selected);
      const selectedImportedData = this.importUnitlist.filter(unit => unit.selected);
      
      const transformedCQImport = selectedImportedData.map(unit => ({
        name: unit["Unit Type"],
        quantity: unit["Unit Type Quantity"],
        adjFactor: unit["ADJ Factor"],
      }));

      const combinedData = [...selectedFormData, ...transformedCQImport];
  
      this.$emit('save-data', combinedData);
    }
  },
};
</script>
