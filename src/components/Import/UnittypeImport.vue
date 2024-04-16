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
        return ""; // Hide boolean columns
      }
      return value; // Show non-boolean columns
    },
    isBooleanColumn(key) {
      return this.importUnitlist.some((unit) => typeof unit[key] === "boolean");
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
