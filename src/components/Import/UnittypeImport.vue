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
    <button type="submit" class="btn-save">Save</button><br /><br />
  </div>
</template>

<script>
import Import from "papaparse";

export default {
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
  },
};
</script>
