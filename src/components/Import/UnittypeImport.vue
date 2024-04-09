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
              v-for="(unit, index) in importUnittype"
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
    <button type="submit" class="btn-save" @click="saveData" >Save</button><br /><br />
  </div>
</template>

<script>
import Import from "papaparse";

export default {
  props: {
    formDataUnitList: {
      type: Array,
      default: () => []
    },
    selectedFormDataList: {
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
      importUnittype: [],
      columnTitles: [],
      selectAll: false,
    };
  },
  computed: {
    filteredColumns() {
      return this.columnTitles.filter((title) => !this.isBooleanColumn(title));
    },
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
      this.importUnittype = data;
      this.columnTitles = Object.keys(data[0]);
    },
    selectAllRows() {
      this.importUnittype.forEach((unit) => {
        unit.selected = this.selectAll;
      });
      this.formDataUnitList.forEach((formDataUnit) => {
        formDataUnit.selected = this.selectAll;
      });
    },
    displayValue(value, key) {
      if (typeof value === "boolean") {
        return ""; // Hide boolean columns
      }
      return value; // Show non-boolean columns
    },
    isBooleanColumn(key) {
      return this.importUnittype.some((unit) => typeof unit[key] === "boolean");
    },
    openCSV() {
      console.log("Button clicked");

      const filePath =
        "file:///C:/Users/zylim/Desktop/Project%20Subcon%20Comparison/src/assets/template/unittype-template.csv";

      window.open(filePath, "_blank");
    },
    downloadExcelTemplate() {
      // Fetch the CSV file using Axios
      axios
        .get("@/assets/template/summary-template.csv", { responseType: "blob" })
        .then((response) => {
          // Create a Blob object from the response data
          const blob = new Blob([response.data], { type: "text/csv" });

          // Create a temporary anchor element
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "excel_template.csv";

          // Programmatically click the anchor element to trigger the download
          link.click();

          // Remove the temporary anchor element
          link.remove();
        })
        .catch((error) => {
          console.error("Error fetching the CSV file:", error);
        });
    },
    // async addUnit(selectedFormDataList, selectedImportedData) {
    //   try {
    //     console.log('Checking to see data', selectedFormDataList, selectedImportedData);
    //     const UpdateMessage = await CallofQuotationController.addUnit(selectedFormDataList, selectedImportedData);
    //     this.$emit('message', UpdateMessage);

    //     selectedFormDataList.forEach(formData => {
    //       const index = this.formDataList.indexOf(formData);
    //       if (index !== -1) {
    //         this.formDataList.splice(index, 1);
    //       }
    //     });

    //     selectedImportedData.forEach(importedRow => {
    //       const index = this.importedData.indexOf(importedRow);
    //       if (index !== -1) {
    //         this.importedData.splice(index, 1);
    //       }
    //     });

    //   } catch (error) {
    //     const FailMessage = "Error updating access permission: " + error.errorMessage;
    //     this.$emit('fail-message', FailMessage);
    //   }
    // },
    saveData() {
      const selectedUnitList = this.formDataUnitList.filter(formDataUnit => formDataUnit.selected);
      const selectedImportUnit = this.importUnittype.filter(unit => unit.selected);

      console.log('Selected Form Data List:', this.selectedFormDataList);
      console.log('Selected Imported Data:', this.selectedImportedData);
      console.log('Form Data Unit List:', selectedUnitList);
      console.log('Imported Unit Type:', selectedImportUnit);

      // Now you can perform further operations with these data sets as needed
      //this.$emit('data-saved', { selectedFormDataList, selectedImportedData });
    }
  },
};
</script>
