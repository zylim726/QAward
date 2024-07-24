<template>
  <div class="content">
    <div class="md-layout">
      <div class="row" style="margin-left: 16px">
        <h6>Project Name :</h6>
        <h3 class="titleHeader">{{ projectName }}</h3>
        <br >
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content style="font-size: 13px !important;line-height: 17px !important">
            <div>
              <div v-if="isLoading" class="spinner-border" role="status">
                <span class="visually-hidden">   
                  <button class="transparentButton" style="margin-right: 10px;cursor: default;">
                    <md-icon style="color: red;margin-bottom:10px;">autorenew</md-icon>
                  </button> Loading...</span>
              </div>
              <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
              <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
              <br>
              <div class="container" v-if="!isLoading">
                <div class="search-container" >
                  <form class="Searchbar">
                    <input
                      type="text"
                      v-model="searchQuery"
                      placeholder="Search"
                    />
                  </form>
                </div>
                <div class="filter-container" style="margin-right: -15px">
                  <a href="createcq" v-if="hasAccess">
                    <div class="tooltip">
                      <span class="tooltiptext">Created Comparison Summary</span>
                    <md-icon class="mdIcon" style="margin-right: 15px"
                      >add</md-icon></div>
                    </a
                  >
                </div>
                <button type="button" class="transparentButton" style="margin-left: 15px;margin-top: -40px;" @click="downloadExcelTemplate">
                    <div class="tooltip">
                    <span class="tooltiptext">Export Comparison Summary</span>
                    <md-icon class="mdIcon">system_update_alt</md-icon>
                    </div>
                </button>
              </div>
              <div class="table-container" style="min-height: 100px;max-height: 600px;">
                <table>
                  <thead>
                    <tr >
                      <th>Action</th>
                      <th>ID</th>
                      <th>Category</th>
                      <th>Trade</th>
                      <th>Location 1</th>
                      <th>No.of Quote</th>
                      <th>Actual Calling Quotation Date</th>
                      <th>Prepare By</th>
                      <th>Actual Done Date</th>
                      <th>Check By</th>
                      <th v-if="callQuotation && callQuotation.length > 0 && callQuotation[0].projectApproval && callQuotation[0].projectApproval.length > 1" 
                          :colspan="callQuotation[0].projectApproval.length - 1">
                        Approved By
                      </th>
                      <th v-else>
                        Approved By
                      </th>
                      <th>Awarding Target Date</th>
                      <th>Remarks</th>
                      <th>Awarded to</th>
                      <th>LA Ref</th>
                      <th>LA Date</th>
                      <th>Budget Amount (RM)</th>
                      <th>Budget (ADJ) Amount (RM)</th>
                      <th>Subcontract Amount (RM)</th>
                      <th>Subcontract (ADJ) Amount (RM)</th>
                      <th>Cost Saving / (Overrun) (RM)</th>
                      <th>Provisional Sum</th>
                      <th style="text-align: center">Status</th>
                    </tr>
                    <tr>
                      <th></th>
                      <th colspan="8"></th>
                      <template v-if="projectApproval && projectApproval.length > 0">
                        <th v-for="(approval, index) in projectApproval" 
                          :key="index">
                        {{ approval.user[0]?.name }}
                      </th>
                      </template>
                      <template v-else>
                        <th></th>
                        <th></th>
                      </template>
                      <th colspan="12"></th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    <tr v-if="errorMessage" ><td colspan="23" class="message">{{ errorMessage }}</td></tr>
                    <tr v-for="(callQuotation, index) in SearchcallQuotation" :key="index">
                      <td><a :href="'/comparison?cqID=' + callQuotation.id"><button class="transparentButton" >
                        <div class="tooltip" >
                          <span class="tooltiptext" style="margin-left: 5px !important;">Go to see subcon comparison detail.</span>
                        <md-icon style="color: orange;">arrow_outward</md-icon></div></button>
                      </a></td>
                      <td>{{ index + 1 }}</td>
                      <td>{{ callQuotation.tradeCategory }}</td>
                      <td>{{ callQuotation.trade }}</td>
                      <td>{{ callQuotation.location }}</td>
                      <td>{{ callQuotation.numberOfQuotations }}</td>
                      <td>{{ formatDate(callQuotation.CallingQuotationDate) !== '0000-00-00' ? formatDate(callQuotation.CallingQuotationDate) : '' }}</td>
                      <td>{{ callQuotation.createdby }}</td>
                      <td>{{ formatDate(callQuotation.actuallDoneDate) !== '0000-00-00' ? formatDate(callQuotation.actuallDoneDate) : '' }}</td>
                      <template v-if="callQuotation.cqApprovals && callQuotation.cqApprovals.length > 0"  >
                        <td v-for="(approval, index) in callQuotation.cqApprovals" :key="index">
                          <span v-if="approval.approval_type === 'CM Approval'">{{ formatDate(approval.updatedAt) }} 
                            <br><h9 style="font-size: 12px;">({{ approval.user[0].name }})</h9></span>
                          <span v-else>{{ formatDate(approval.updatedAt) }}</span>
                        </td>
                      </template>
                      <template v-else>
                        <template v-if="projectApproval && projectApproval.length > 0">
                          <td v-for="(approval, index) in callQuotation.projectApproval" :key="index"></td>
                        </template>
                        <template v-else>
                          <td></td>
                        </template>
                      </template>
                      <td>{{ formatDate(callQuotation.awadingtargetdate) !== '0000-00-00' ? formatDate(callQuotation.awadingtargetdate) : '' }}</td>
                      <td>{{ callQuotation.remarks }}</td>
                      <template v-if="callQuotation.is_work_order === true">
                        <td>{{ callQuotation.Wo && callQuotation.Wo.length > 0 ? callQuotation.Wo[0].Subcon.name : '' }}</td>
                        <td><a :href="'/approveComparison?woCqId=' + callQuotation.id" class="notify-status">{{ callQuotation.Wo && callQuotation.Wo.length > 0 ? callQuotation.Wo[0].wo_code : '' }}</a></td>
                        <td>{{ callQuotation.Wo && callQuotation.Wo.length > 0 ? formatDate(callQuotation.Wo[0].createdAt) : '' }}</td>
                      </template>
                      <template v-else>
                        <td>{{ callQuotation.La && callQuotation.La.length > 0 ? callQuotation.La[0].Subcon.name : '' }}</td>
                        <td><a :href="'/approveComparison?laCqId=' + callQuotation.id" class="notify-status">{{ callQuotation.La && callQuotation.La.length > 0 ? callQuotation.La[0].la_code : '' }}</a></td>
                        <td>{{ callQuotation.La && callQuotation.La.length > 0 ? formatDate(callQuotation.La[0].createdAt) : '' }}</td>
                      </template>
                      <td>{{ formatAccounting(callQuotation.budget_amount) }}</td>
                      <td>{{ formatAccounting(callQuotation.adj_budget_amount) }}</td>
                      <td>{{ formatAccounting(callQuotation.subcontract_amount) }}</td>
                      <td>{{ formatAccounting(callQuotation.adj_subcontract_amount) }}</td>
                      <td>{{ formatAccounting(callQuotation.total_saving) }}</td>
                      <td>{{ formatAccounting(callQuotation.provisional_sum) }}</td>
                      <td> 
                        <span class="notify-status">{{ callQuotation.status }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
    </div>
</template>

<script>
const XLSX = require('xlsx');
import { ref } from "vue";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";

import { checkAccess } from "@/services/axios/accessControl.js";

export default {
  components: {
  
  },
  data() {
    return {
      show: ref(false),
      searchQuery: "",
      openedDropdown: null,
      projectName: "",
      errorMessage: "",
      callQuotation: [],
      projectApproval:[],
      UpdateMessage: null,
      FailMessage: null,
      item: null,
      hasAccess: false,
      isLoading: false,
    };
  },
  computed: {
    SearchcallQuotation() {
      let searchData = this.callQuotation;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        searchData = searchData.filter(
          (callQuotation) =>
            callQuotation.trade.toLowerCase().includes(query) ||
            callQuotation.tradeCategory.toLowerCase().includes(query) ||
            callQuotation.location.toLowerCase().includes(query)
        );
      }
      return searchData;
    },
  },
  mounted() {
    const projectName = localStorage.getItem('projectName');
    if (projectName) {
      this.projectName = projectName;
    } else {
      this.FailMessage = "Project ID not found in localStorage";
    };
    this.accessCQ();
  },
  async created() {
    await this.checkPermission();
  },
  methods: {
    formatAccounting(value) {
      if (!value) {
        return '0.00';
      }
      return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    downloadExcelTemplate() {
      const wb = XLSX.utils.book_new();
      const table = document.querySelector('table');
      const clonedTable = table.cloneNode(true);

      // Remove first column from each row (Actions column)
      clonedTable.querySelectorAll('tr').forEach(row => {
        row.deleteCell(0);
      });

      // Update table cells based on conditions
      clonedTable.querySelectorAll('td').forEach(cell => {
        // Replace cell content with empty string if it matches '0000-00-00'
        if (cell.textContent.trim() === '0000-00-00') {
          cell.textContent = '';
        }
      });

      const ws = XLSX.utils.table_to_sheet(clonedTable);
      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

      XLSX.writeFile(wb, 'summary.xlsx');
    },
    async accessCQ() {
      try {
        this.isLoading = true;
        const processedData = await CallofQuotationController.accessCQ();
        if (Array.isArray(processedData) && processedData.length > 0) {
          this.callQuotation = processedData;
          console.log('this CallQuotation',this.callQuotation);
          this.projectApproval = processedData[0].projectApproval;
        } else {
          this.errorMessage = "No data.";
        }
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || 'Unknown error'}`;
      } finally {
        this.isLoading = false;
      }
    },
    closeOtherDropDowns(clickedItem) {
      if (this.openedDropdown && this.openedDropdown !== clickedItem) {
        this.openedDropdown.dropdown.closeDropDown();
      }
      this.openedDropdown = clickedItem;
    },
    async checkPermission() {
      try {
        const permission = await checkAccess(); 
        const accessIds = ['Add-Edit-Remove CQ'];
        this.hasAccess = accessIds.some(id => permission.includes(id));
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || 'Unknown error'}`;
      }
    },
    formatDate(dateTimeString) {
      if (!dateTimeString) return '';

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return ''; 
      }

      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }


  },
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  color: #333;
  overflow-x: auto; 
}

thead th {
  background-color: #fef4e4;
  border-bottom: none;
  padding: 10px;
  text-align: left;

}

tbody td {
  padding: 12px;
  text-align: left;
  white-space: nowrap; 
  border: 1px solid #ddd;
}
</style>
