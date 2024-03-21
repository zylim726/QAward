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
    <br />
    <button type="submit" class="btn-save">Save</button><br /><br />
  </div>
</template>

<script>
import Import from "papaparse";

export default {
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
      this.importedData = data;
      this.columnTitles = Object.keys(data[0]);
    },
    selectAllRows() {
      this.importedData.forEach((row) => {
        row.selected = this.selectAll;
      });
    },
    displayValue(value, key) {
      if (typeof value === "boolean") {
        return ""; // Hide boolean columns
      }
      return value; // Show non-boolean columns
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
