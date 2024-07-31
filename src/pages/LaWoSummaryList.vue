<template>
  <div class="content">
    <div v-if="isLoading" class="spinner-border" role="status">
      <span class="visually-hidden">
        <button class="transparentButton" style="margin-right: 10px; cursor: default;">
          <md-icon style="color: red; margin-bottom:10px;">autorenew</md-icon>
        </button> Loading...
      </span>
    </div>
    <div v-if="UpdateMessage" class="notification success">
      {{ UpdateMessage }} 
      <md-icon style="color:green">check_circle_outline</md-icon>
    </div>
    <div v-if="FailMessage" class="notification fail">
      {{ FailMessage }} 
      <md-icon>cancel</md-icon>
    </div>
    <br>
    <div class="md-layout">
      <div class="row" style="margin-left: 16px">
        <h6>Project Name :</h6>
        <h3 class="titleHeader">{{ projectName }}</h3>
        <br>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <div class="table-container" style="display: flex; justify-content: space-between;">
          
          <md-card class="table-wrapper" style="width: 48%;">
            <md-card-content style="font-size: 13px !important; line-height: 17px !important">
              <div class="container" v-if="!isLoading">
                <div class="search-container"></div>
                <button type="button" class="transparentButton" style="margin-left: 15px;" @click="exportTables">
                  <div class="tooltip">
                    <span class="tooltiptext" style="margin-bottom: -130px;">Download LA Summary List</span>
                    <md-icon class="mdIcon">system_update_alt</md-icon>
                  </div>
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Code</th>
                    <th>Subcon Name</th>
                    <th>Provisional Sum</th>
                    <th>Contact Sum</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(laData, index) in LaData" :key="index">
                    <td><a :href="'/approveComparison?laCqId=' + laData.cqId"><button class="transparentButton" >
                        <div class="tooltip" >
                          <span class="tooltiptext" style="margin-left: 5px !important;">Go to see La detail.</span>
                        <md-icon style="color: orange;">arrow_outward</md-icon></div></button>
                      </a></td>
                    <td>{{ laData.code }}</td>
                    <td>{{ laData.subconName }}</td>
                    <td>{{ laData.provisional_sum }}</td>
                    <td>{{ laData.contract_sum }}</td>
                    <td>{{ laData.updateDate }}</td>
                  </tr>
                </tbody>
              </table>
            </md-card-content>
          </md-card>
          <md-card class="table-wrapper" style="width: 48%;">
            <md-card-content style="font-size: 13px !important; line-height: 17px !important">
              <div class="container" v-if="!isLoading">
                <div class="search-container"></div>
                <button type="button" class="transparentButton" style="margin-left: 15px;" @click="exportTables">
                  <div class="tooltip" >
                    <span class="tooltiptext" style="margin-bottom: -140px;">Download Work Order Summary List</span>
                    <md-icon class="mdIcon">system_update_alt</md-icon>
                  </div>
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Code</th>
                    <th>Subcon Name</th>
                    <th>Provisional Sum</th>
                    <th>Contact Sum</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(woData, index) in WoData" :key="index">
                    <td><a :href="'/approveComparison?woCqId=' + woData.cqId"><button class="transparentButton" >
                        <div class="tooltip" >
                          <span class="tooltiptext" style="margin-left: 5px !important;">Go to see work order details.</span>
                        <md-icon style="color: orange;">arrow_outward</md-icon></div></button>
                      </a></td>
                    <td>{{ woData.code }}</td>
                    <td>{{ woData.subconName }}</td>
                    <td>{{ woData.provisional_sum }}</td>
                    <td>{{ woData.contract_sum }}</td>
                    <td>{{ woData.updateDate }}</td>
                  </tr>
                </tbody>
              </table>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const XLSX = require('xlsx');
import { ref } from "vue";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";
import LaController from "@/services/controllers/LaController.js";

export default {
  components: {},
  data() {
    return {
      show: ref(false),
      searchQuery: "",
      projectName: "",
      errorMessage: "",
      callQuotation: [],
      UpdateMessage: null,
      FailMessage: null,
      isLoading: false,
      WoData: [],
      LaData: [],
    };
  },
  computed: {},
  mounted() {
    const projectName = localStorage.getItem('projectName');
    if (projectName) {
      this.projectName = projectName;
    } else {
      this.FailMessage = "Project ID not found in localStorage";
    }
    this.accessCQApprove();
  },
  methods: {
    formatAccounting(value) {
      if (!value) {
        return "0.00";
      }
      return parseFloat(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    async accessCQApprove() {
      try {
        this.isLoading = true;
        const processedData = await CallofQuotationController.accessCQApprove();
        if (Array.isArray(processedData) && processedData.length > 0) {
          this.callQuotation = processedData;
          this.checkIsWorkOrder();
        } else {
          this.errorMessage = "No data.";
        }
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || "Unknown error"}`;
      } finally {
        this.isLoading = false;
      }
    },
    async checkIsWorkOrder() {
      const woPromises = [];
      const laPromises = [];

      this.callQuotation.forEach((item) => {
        if (item.is_work_order) {
          woPromises.push(this.callWo(item.id));
        } else {
          laPromises.push(this.callLa(item.id));
        }
      });

      try {
        const woResults = await Promise.all(woPromises);
        const laResults = await Promise.all(laPromises);

        this.WoData = woResults.flat().filter(data => data !== undefined);
        this.LaData = laResults.flat().filter(data => data !== undefined);

      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || "Unknown error"}`;
      }
    },

    async callWo(id) {
      try {
        const processedData = await LaController.accessWO(id);
        return processedData; 
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || "Unknown error"}`;
        return []; 
      }
    },

    async callLa(id) {
      try {
        const processedData = await LaController.accessLa(id);
        return processedData; 
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || "Unknown error"}`;
        return []; 
      }
    },
    closeOtherDropDowns(clickedItem) {
      if (this.openedDropdown && this.openedDropdown !== clickedItem) {
        this.openedDropdown.dropdown.closeDropDown();
      }
      this.openedDropdown = clickedItem;
    },
    formatDate(dateTimeString) {
      if (!dateTimeString) return "";

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return "";
      }

      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    },
    exportTables() {
      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Combine WoData and LaData
      const combinedData = [
        ...this.WoData.map(item => ({
          Type: 'Work Order',
          Code: item.code,
          'Subcon Name': item.subconName,
          'Provisional Sum': item.provisional_sum,
          'Contact Sum': item.contract_sum,
          Date: item.updateDate
        })),
        ...this.LaData.map(item => ({
          Type: 'LA Data',
          Code: item.code,
          'Subcon Name': item.subconName,
          'Provisional Sum': item.provisional_sum,
          'Contact Sum': item.contract_sum,
          Date: item.updateDate
        }))
      ];

      // Prepare the combined data sheet
      const wsCombined = XLSX.utils.json_to_sheet(combinedData);
      XLSX.utils.book_append_sheet(wb, wsCombined, 'Combined Data');

      // Export the workbook
      XLSX.writeFile(wb, 'Combined_Work_Order_and_LA_Data.xlsx');
    }
  },
};
</script>

<style scoped>
.table-container {
  display: flex;
  justify-content: space-between;
}

tbody td {
  border: none !important;
}



</style>
