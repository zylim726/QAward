<template>
  <div>
    <div v-if="loading" class="spinner-border" role="status">
      <span class="visually-hidden">   
        <button class="transparentButton" style="margin-right: 10px;cursor: default;">
          <md-icon style="color: red;margin-bottom:10px;">autorenew</md-icon>
        </button> Loading...</span>
    </div>
    <label
      for="fileInput"
      style="margin-right: 10px; float: right"
      class="file-label"
    >
      <div class="tooltip">
        <span class="tooltiptext">Upload your comparison summary</span>
        <md-icon class="mdIcon">upload_file</md-icon>
      </div>
      <input id="fileInput" type="file" @change="projectUpload" />
    </label>
    <button
      @click="downloadExcelTemplate"
      class="transparentButton"
      style="margin-right: 10px; float: right"
    >
      <div class="tooltip">
        <span class="tooltiptext"
          >Download comparison summary then upload the new file.</span
        >
        <md-icon class="mdIcon">download_for_offline</md-icon>
      </div>
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
            <th scope="col">Actual Calling Quotation Date (dd/mm/yyyy)</th>
            <th scope="col">Awarding Target Date (dd/mm/yyyy)</th>
            <th scope="col">Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(formData, index) in formDataList" :key="index" :class="{ 'selected-row': formData.selected }">
            <td><input type="checkbox" v-model="formData.selected"></td>
            <td>{{ formData.tradeCategory }}</td>
            <td>{{ formData.trade }}</td>
            <td>{{ formData.location }}</td>
            <td>{{ displayDate(formData.callingquotationDate) }}</td>
            <td>{{ displayDate(formData.awadingtaget) }}</td>
            <td>{{ formData.remarks }}</td>
          </tr>
          <tr v-for="(row, index) in importedData" :key="'importedData' + index" :class="{ 'selected-row': row.selected }">
            <td><input type="checkbox" v-model="row.selected"></td>
            <td v-for="column in filteredColumns" :key="column">{{ displayValue(row[column], column) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button type="submit" class="btn-save" @click="saveData">Save</button><br /><br />
  </div>
</template>

<script>
import Import from "papaparse";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";

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
      selectAll: true,
      loading: false,
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
      const filteredData = data.filter(row => {
        return Object.values(row).some(value => value !== '');
      });

      this.importedData = filteredData.map(row => ({
        ...row,
        selected: true 
      }));
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
    displayDate(dateStr) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = monthNames[parseInt(month, 10) - 1];
        return `${day}-${monthName}-${year}`;
      }
      return dateStr; 
    },
    isBooleanColumn(key) {
      return this.importedData.some((row) => typeof row[key] === "boolean");
    },
    downloadExcelTemplate() {
      const csvHeader = 'Category,Trade,Location 1,Actual Calling Quotation Date (dd/mm/yyyy),Awarding Target Date (dd/mm/yyyy),Remarks\n';

      const csvRows = [
        ',PROJECT SIGNAGE,,,,',
        ',TEMPORARY HOARDING WORK,,,,',
        ',SITE PREPARATION WORK,,,,',
        ',TEMPORARY ACMV,,,,',
        ',TEMPORARY ELECTICAL,,,,',
        ',TEMPORARY WATER SUPPLY,,,,',
        ',CONSULTATION,,,,',
        ',DILAPIDATION WORKS,,,,',
        ',NOISE MONITORING & WASTE WATER ANALYSIS,,,,',
        ',SURVEY WORK,,,,',
        ',TEMPORARY BUILDING,,,,',
        ',TEMPORARY SUPPORT,,,,',
        ',SCAFFOLDING,,,,',
        ',MOSQUITO CONTROL/FOGGING,,,,',
        ',PROTECTION WORK,,,,',
        ',COW,,,,',
        ',SITE STAFF,,,,',
        ',DEFECT WORK,,,,',
        ',CLEANING WORK,,,,',
        ',CONCRETE WORK,,,,',
        ',ALUMINUM FORMWORK,,,,',
        ',METAL FORMWORK,,,,',
        ',TIMBER FORMWORK,,,,',
        ',REINFORCEMENT WORK,,,,',
        ',PILING WORK,,,,',
        ',ANTI-TERMITE WORK,,,,',
        ',BRICKWORK,,,,',
        ',BLOCKWORK,,,,',
        ',WATERPROOFING WORK,,,,',
        ',ALUMINIUM & GLAZING WORKS,,,,',
        ',DOOR & IRONMONGERIES AND TIMBER HANDRAIL INSTALLATION,,,,',
        ',FRP DOOR,,,,',
        ',METAL ROOFING & FLASHING WORK,,,,',
        ',ROOF TILES INSTALLER,,,,',
        ',ROOF TRUSS & FASCIA BOARD WORK,,,,',
        ',RAINWATER GOODS,,,,',
        ',RAINWATER HARVESTING SYSTEM,,,,',
        ',MILD STEEL WORK,,,,',
        ',STEEL LINTOL,,,,',
        ',STEEL STRUCTURAL WORK,,,,',
        ',STAINLESS STEEL WORK,,,,',
        ',TILING WORK,,,,',
        ',PLASTERING WORK,,,,',
        ',SKIMCOAT WORK,,,,',
        ',SKIM RENDERING WORK,,,,',
        ',PAINTING WORK,,,,',
        ',CEILING WORK,,,,',
        ',ROLLER SHUTTER,,,,',
        ',LAMINATED FLOORING WORK,,,,',
        ',FLOOR HARDENER & POWER FLOAT,,,,',
        ',EARTHWORK & EXCAVATION,,,,',
        ',DRAINAGE WORK,,,,',
        ',EXTERNAL SEWERAGE WORK,,,,',
        ',EXTERNAL WATER RETICULATION WORK,,,,',
        ',RETAINING WALL WORK,,,,',
        ',EXTERNAL FENCING WORK,,,,',
        ',CONCRETE IMPRINT & BROOM FINISH,,,,',
        ',ROADWORKS,,,,',
        ',ROAD MARKING,,,,',
        ',ROAD SIGNAGE,,,,',
        ',INTERLOCKING PAVER,,,,',
        ',UNDERGROUND MAPPING,,,,',
        ',SUNDRIES WORK,,,,',
        ',HOUSE NUMBER PLATE & SIGNAGE,,,,',
        ',HARDSCAPE WORK,,,,',
        ',SOFTSCAPE WORK,,,,',
        ',COLD WATER & SANITARY PLUMBING WORKS,,,,',
        ',ELECTRICAL WORK,,,,',
        ',ACMV WORK,,,,',
        ',FIRE PROTECTION WORK,,,,',
        ',SECURITY SYSTEM,,,,',
    ];

      const csvContent = csvHeader + csvRows.join('\n');
      const hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'la_template.csv';
      hiddenElement.click();
    },
    async saveData() {
      this.loading = true;
      const selectedFormData = this.formDataList.filter(formData => formData.selected);
      const selectedImportedData = this.importedData.filter(importedRow => importedRow.selected);

      const transformedCQImport = selectedImportedData.map(unit => ({
        tradeCategory: unit["Category"],
        trade: unit["Trade"],
        location: unit["Location 1"],
        callingquotationDate: unit["Actual Calling Quotation Date (dd/mm/yyyy)"],
        awadingtaget: unit["Awarding Target Date (dd/mm/yyyy)"],
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
        this.loading = false;
        const FailMessage = `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        window.scrollTo(0, 0); 
        this.$emit('fail-message', FailMessage);
      } finally {
        this.loading = false; 
      }
    }
  },
};
</script>
