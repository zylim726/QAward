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
  </div>
</template>
<script>
import Import from "papaparse";

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
      selectAll: false,
    };
  },
  computed: {
    filteredColumns() {
      return this.columnTitles.filter((title) => !this.isBooleanColumn(title));
    },
  },
  watch: {
    formDataList: {
      handler(newValue) {
        const selectedFormData = newValue.filter(formData => formData.selected);
        const selectedImportedData = this.importedData.filter(row => row.selected);
        this.emitSelectedData(selectedFormData, selectedImportedData);
      },
      deep: true
    },
    importedData: {
      handler(newValue) {
        const selectedFormData = this.formDataList.filter(formData => formData.selected);
        const selectedImportedData = newValue.filter(row => row.selected);
        this.emitSelectedData(selectedFormData, selectedImportedData);
      },
      deep: true
    }
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
    openCSV() {
      console.log("Button clicked");

      const filePath =
        "file:///C:/Users/zylim/Desktop/Project%20Subcon%20Comparison/src/assets/template/template.csv";

      window.open(filePath, "_blank");
    },
    downloadExcelTemplate() {
      axios
        .get("@/assets/template/summary-template.csv", { responseType: "blob" })
        .then((response) => {
          
          const blob = new Blob([response.data], { type: "text/csv" });

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "excel_template.csv";

          link.click();
          link.remove();
        })
        .catch((error) => {
          console.error("Error fetching the CSV file:", error);
        });
    },
    emitSelectedData(selectedFormData, selectedImportedData) {
      this.$emit('data-saved', { selectedFormData, selectedImportedData });
    }
  },
};
</script>
