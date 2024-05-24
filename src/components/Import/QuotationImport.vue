<template>
  <div>
    <label
      for="QuotationInput"
      style="margin-right: 10px; float: right"
      class="file-label"
    >
      <md-icon class="mdIcon">upload_file</md-icon>
      <input id="QuotationInput" type="file" @change="quotationUpload" />
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
            <th scope="col">Item</th>
            <th scope="col">Element</th>
            <th scope="col">Sub Element</th>
            <th scope="col">Sub Sub Element</th>
            <th scope="col">Description</th>
            <th scope="col">Unit</th>
            <th scope="col" v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.type }}</th>
            <th scope="col">BQ Qty</th>
            <th scope="col">ADJ Qty</th>
            <th scope="col">QTY</th>
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
  </div>
</template>

<script>
import Import from "papaparse";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";

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
      columnTitles: [],
      selectAll: false,
      Unittype: [],
    };
  },
  watch: {
    cqId(newValue, oldValue) {
      this.getUnittype(newValue);
    }
  },
  computed: {
    filteredColumns() {
      return this.columnTitles.filter((title) => !this.isBooleanColumn(title));
    },
  },
  methods: {
    async getUnittype(id) {
      try {
        const processedData = await CallofQuotationController.getUnittype(id);
        this.Unittype = processedData;
      } catch (error) {
        console.error('Error fetching Unittype:', error);
      }
    },
    quotationUpload(event) {
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
        return "";
      }
      return value; 
    },
    isBooleanColumn(key) {
      return this.importedData.some((row) => typeof row[key] === "boolean");
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
  },
};
</script>
