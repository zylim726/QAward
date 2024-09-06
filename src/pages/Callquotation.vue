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
              <loading-modal v-if="isLoading" /><br><br>
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
                    <tr  class="header-row-1">
                      <th >Action</th>
                      <th>ID</th>
                      <th>Category</th>
                      <th>Trade</th>
                      <th>Location 1</th>
                      <th>No.of Quote</th>
                      <th>Actual Calling Quotation Date</th>
                      <th>Prepare By</th>
                      <th>Actual Done Date</th>
                      <th :colspan="getMaxCqApprovalsLength()">
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
                    <tr :class="headerClass">
                      <th :style="{ 'top': '0' }"></th>
                      <th :style="{ 'top': '0' }" colspan="8"></th>
                      <th v-for="(approval, index) in maxprojectApprovalData" :key="index">
                        {{ approval.user.name || approval.user[0].name }}
                      </th>
                      <th :style="{ 'top': '0' }" colspan="12"></th>

                    </tr>
                  </thead>
                  
                  <tbody>
                    <tr v-if="errorMessage" ><td colspan="23" class="message">{{ errorMessage }}</td></tr>
                    <tr v-for="(callQuotation, index) in SearchcallQuotation" :key="index">
                      <td><a :href="'/comparison?cqID=' + callQuotation.id + '&projectID=' + callQuotation.projectId"><button class="transparentButton" >
                        <div class="tooltip" >
                          <span class="tooltiptext" style="margin-left: 5px !important;">Go to see subcon comparison detail.</span>
                        <md-icon style="color: orange;">arrow_outward</md-icon></div></button>
                      </a></td>
                      <td>{{ index + 1 }}</td>
                      <td>{{ callQuotation.tradeCategory }}</td>
                      <td v-if="callQuotation.status === 'Approved'">
                       {{ callQuotation.trade }}<md-icon class="mdIcon" style="color: darkseagreen !important;" >check_circle</md-icon>
                      </td>
                      <td v-else-if="callQuotation.status === 'Pending'">
                      {{ callQuotation.trade }}<md-icon class="mdIcon" style="color: lightgray !important;" >pending</md-icon>
                      </td>
                      <td v-else>
                       {{ callQuotation.trade }}<md-icon class="mdIcon" style="color: orange !important;">error</md-icon>
                      </td>
                      <td>{{ callQuotation.location }}</td>
                      <td>{{ callQuotation.numberOfQuotations }}</td>
                      <td>{{ formatDate(callQuotation.CallingQuotationDate) !== '0000-00-00' ? formatDate(callQuotation.CallingQuotationDate) : '' }}</td>
                      <td>{{ callQuotation.createdby }}</td>
                      <td>{{ formatDate(callQuotation.actuallDoneDate) !== '0000-00-00' ? formatDate(callQuotation.actuallDoneDate) : '' }}</td>
                      <template v-if="mergeApprovals(callQuotation).length === 0">
                        <td></td>
                      </template>
                      <template v-else>
                        <td v-for="(approval, i) in mergeApprovals(callQuotation)" :key="'approval-' + i">
                          <span>{{ approval && approval.updatedAt ? (approval.updatedAt !== '0000-00-00' ? formatDate(approval.updatedAt) : '') : '' }}</span>
                        </td>
                      </template>
                      <td>{{ formatDate(callQuotation.awadingtargetdate) !== '0000-00-00' ? formatDate(callQuotation.awadingtargetdate) : '' }}</td>
                      <td>{{ callQuotation.remarks }}</td>
                      <template v-if="callQuotation.is_work_order === true">
                        <td>{{ callQuotation.Wo && callQuotation.Wo.length > 0 ? callQuotation.Wo[0].Subcon.name : '' }}</td>
                        <td>
                          <a v-if="callQuotation.Wo && callQuotation.Wo.length > 0" 
                            :href="'/approveComparison?woCqId=' + callQuotation.id" 
                            class="notify-status">
                            {{ callQuotation.Wo[0].wo_code }}
                          </a>
                        </td>
                        <td>{{ callQuotation.Wo && callQuotation.Wo.length > 0 ? formatDate(callQuotation.Wo[0].createdAt) : '' }}</td>
                      </template>
                      <template v-else>
                        <td>{{ callQuotation.La && callQuotation.La.length > 0 ? callQuotation.La[0].Subcon.name : '' }}</td>
                        <td>
                          <a v-if="callQuotation.La && callQuotation.La.length > 0" 
                           
                            class="notify-status">
                            {{ callQuotation.La[0].la_code }}
                          </a>
                        </td>
                        <td>{{ callQuotation.La && callQuotation.La.length > 0 ? formatDate(callQuotation.La[0].createdAt) : '' }}</td>
                      </template>
                      <td>{{ formatAccounting(callQuotation.budget_amount) }}</td>
                      <td>{{ formatAccounting(callQuotation.adj_budget_amount) }}</td>
                      <td>{{ formatAccounting(callQuotation.subcontract_amount) }}</td>
                      <td>{{ formatAccounting(callQuotation.adj_subcontract_amount) }}</td>
                      <td>{{ formatAccounting(callQuotation.total_saving) }}</td>
                      <td>{{ formatAccounting(callQuotation.provisional_sum) }}</td>
                      <td>{{ callQuotation.status }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="summary-row">
                      <th></th>
                      <td colspan="8"></td>
                      <td v-for="(approval, index) in maxprojectApprovalData" :key="'tfoot-approval-' + index" style="text-align: center;"></td>
                      <td colspan="5" style="text-align: right; font-weight: bold;">Total:</td>
                      <td>{{ formatAccounting(SumTotal.budget_amount || 0) }}</td>
                      <td>{{ formatAccounting(SumTotal.adj_budget_amount || 0) }}</td>
                      <td>{{ formatAccounting(SumTotal.subcontract_amount || 0) }}</td>
                      <td>{{ formatAccounting(SumTotal.adj_subcontract_amount || 0) }}</td>
                      <td>{{ formatAccounting(SumTotal.total_saving || 0) }}</td>
                      <td>{{ formatAccounting(SumTotal.provisional_sum || 0) }}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table><br><br>
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
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";
import { checkAccess } from "@/services/axios/accessControl.js";

export default {
  components: {
    LoadingModal
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
      SumTotal:[],
      UpdateMessage: null,
      FailMessage: null,
      item: null,
      hasAccess: false,
      isLoading: false,
      isMobile: false,
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
    maxprojectApprovalData() {
      return this.maxprojectApproval();
    },
    headerClass() {
      return this.isMobile ? 'header-title-2 mobile' : 'header-title-2 desktop';
    }
  },
  mounted() {
    const projectName = localStorage.getItem('projectName');
    if (projectName) {
      this.projectName = projectName;
    } else {
      this.FailMessage = "You haven't select the project in project list.";
    };
    this.accessCQ();
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  async created() {
    await this.checkPermission();
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth < 768; // Adjust breakpoint as needed
    },
    getMaxCqApprovalsLength() {
      let maxLength = 0;
      this.callQuotation.forEach(quotation => {
        const combinedApprovals = [...quotation.cqApprovals, ...quotation.projectApproval];
        const uniqueApprovals = Array.from(
          new Map(combinedApprovals.map(item => [item.system_user_id, item])).values()
        );

        let cqApprovalsLength = (uniqueApprovals || []).length;

        if (cqApprovalsLength > maxLength) {
          maxLength = cqApprovalsLength;
        }

      });

      return maxLength;
    },
    maxprojectApproval() {
      const maxLength = this.getMaxCqApprovalsLength();

      // Combine all approvals from each quotation
      const combinedApprovals = this.callQuotation.flatMap(quotation => 
        [...quotation.cqApprovals, ...quotation.projectApproval]
      );

      // Remove duplicates based on system_user_id
      const uniqueApprovals = Array.from(
        new Map(combinedApprovals.map(item => [item.system_user_id, item])).values()
      );

      // Create the result array with the maxLength
      const result = Array.from({ length: maxLength }, (_, index) => {
        return uniqueApprovals[index] || { user: [{ name: '' }] };
      });

      return result;
    },
    mergeApprovals(quotation) {
      const maxLength = this.getMaxCqApprovalsLength();

      const cqApprovals = quotation.cqApprovals || [];
      const projectApprovals = quotation.projectApproval || [];

      const combinedApprovals = [...cqApprovals, ...projectApprovals];

      const uniqueApprovals = Array.from(
        new Map(combinedApprovals.map(item => [item.system_user_id, item])).values()
      );

      const maxProjectApprovalIds = this.maxprojectApproval();
                       
      const filledApprovals = [];
      const seenUserIds = new Set();

      for (let i = 0; i < maxLength; i++) {
        const userId = maxProjectApprovalIds[i]?.system_user_id;
      
        if (userId !== undefined) {
          const approval = cqApprovals.find(app => app.system_user_id === userId);
          filledApprovals.push(approval || { system_user_id: userId, updatedAt: '00-00-0000' });
          seenUserIds.add(userId);
        } else {
          const remainingApproval = uniqueApprovals.find(app => !seenUserIds.has(app.system_user_id));

          if (remainingApproval) {
            filledApprovals.push(remainingApproval);
            seenUserIds.add(remainingApproval.system_user_id);
          } else {
            filledApprovals.push({ system_user_id: '', updatedAt: '00-00-0000' });
          }
        }
      }

      return filledApprovals;
    },
    formatAccounting(value) {
      if (typeof value === 'string') {
        // Remove parentheses and check if the value is negative
        const cleanedValue = value.replace(/[()]/g, '');
        const isNegative = value.includes('(');

        // Parse the cleaned value to a float
        const numberValue = parseFloat(cleanedValue);
        
        if (isNaN(numberValue)) {
          return '0.00'; // or handle as needed
        }

        // Format the number with two decimal places
        const formattedValue = numberValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        // Add parentheses if the value is negative
        return isNegative ? `(${formattedValue})` : formattedValue;
      }

      // Handle cases where value is not a string or invalid
      return '0.00';
    },
    downloadExcelTemplate() {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Select the table element
      const table = document.querySelector('table');
      
      // Clone the table to avoid altering the original DOM
      const clonedTable = table.cloneNode(true);
      
      // Remove the first column from each row (Actions column)
      clonedTable.querySelectorAll('tr').forEach(row => {
        if (row.cells.length > 0) {
          row.deleteCell(0);
        }
      });
      
      // Update table cells based on conditions
      clonedTable.querySelectorAll('td').forEach(cell => {
        // Replace cell content with an empty string if it matches '0000-00-00'
        if (cell.textContent.trim() === '0000-00-00') {
          cell.textContent = '';
        }
      });
      
      // Convert the cloned table to a worksheet
      const ws = XLSX.utils.table_to_sheet(clonedTable);
      
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
      
      // Write the workbook to a file
      XLSX.writeFile(wb, 'summary.xlsx');
    },
    async accessCQ() {
      try {
        this.isLoading = true;
        const processedData = await CallofQuotationController.accessCQ();
        if (Array.isArray(processedData) && processedData.length > 0) {
          this.callQuotation = processedData;
          this.SumTotal = processedData[0].Sum;
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
}


.summary-row {
  background-color: #f9f9f9;
  font-weight: bold;
}

.summary-row td {
  border-top: 2px solid #ddd;
}

/* Default for desktop */
.header-title-2 {
  position: sticky;
}

.header-title-2.desktop {
  top: 52px; /* For larger screens (desktops) */
}

.header-title-2.mobile {
  top: 20px; /* For smaller screens (mobile) */
}

@media (max-width: 767px) {
  /* Mobile view styles */
  .header-title-2 {
    top: 20px;
  }
}

@media (min-width: 768px) {
  /* Desktop view styles */
  .header-title-2 {
    top: 70px;
  }
}


</style>
