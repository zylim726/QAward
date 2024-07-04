<template>
  <div>
    <div v-if="isLoading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="container" style="margin-top: 20px">
      <div class="search-container">
        <form class="Searchbar">
          <input type="text" v-model="searchQuery" @input="handleInputChange" placeholder="Search Description....." />
        </form>
      </div>
      <div class="filter-container">
        <a :href="'revision?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px">Revision</button></a>
        <a :href="'quotation?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px"   v-if="isPending" >Add Quotation</button></a>
        <a :href="'description?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px"  v-if="QuotationName.length <= 1">Add Description</button></a>
        <button @click="toggleFilter" class="transparentButton" style="margin-right: 10px" v-if="!isLoading">
          <div class="tooltip" >
            <span class="tooltiptext">Hide unit type information. Please click to open see details.</span>
            <md-icon class="mdIcon">{{ isHide ? 'visibility_off' : 'visibility' }}</md-icon>
          </div>
        </button>
        <button type="button" class="transparentButton" style="margin-right: 10px" @click="downloadExcelTemplate">
          <div class="tooltip" >
            <span class="tooltiptext">Export Subcon Comparison to see more.</span>
            <md-icon class="mdIcon">system_update_alt</md-icon>
          </div>
        </button>
      </div>
    </div>
    <div class="table-container">
      <table ref="dataTable" class="nested-table" id="data-table">
        <thead>
          <tr>
            <th colspan="6"></th>
            <template v-if="!isHide">
              <th scope="col" v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;"></th>
              <th colspan="1"></th>
            </template>
            <th>
              <div class="tooltip" >
                <span class="tooltiptext" style="margin-bottom: -127px !important;margin-left: -167px;width: 178px !important;">
                  ADJ Quantity formula = (Unit Type Quantity x Description Quantity) x ADJ Factor</span>
                <md-icon style="color: red;margin-top: 10px;margin-right: -10px;">priority_high</md-icon>
              </div>
            </th>
            <th scope="col" colspan="2" v-for="(quotationData, index) in QuotationName" :key="index" style="text-align: center;border:1px solid #ddd !important">
              <div class="tooltip" >
                <span class="tooltiptext" style="margin-bottom: -107px !important;margin-left: -167px;width: 178px !important;">
                Formula Quotation rate = ADJ Quantity x Quotation Rate</span>
                <md-icon style="color: red;margin-top: 10px;margin-right: -10px;"  
                  v-if="isPending && quotationData.Call_For_Quotation_Subcon_List.subcon_id !== 1" 
                > priority_high</md-icon>
              </div>
              <a :href="'editquotation?cqId=' + cqId + '&sbConId=' + quotationData.Call_For_Quotation_Subcon_List.subcon_id"  v-if="isPending">
                <button type="button" class="transparentButton"  >
                  <div class="tooltip" >
                    <span class="tooltiptext" style="margin-bottom: -95px !important;margin-right: -6px;" >
                    Edit Quotation Rate</span>
                    <md-icon style="color:orange;margin-left: 26px;margin-top: 10px;">edit_note</md-icon>
                  </div>
                </button>
              </a>
              <button style="margin-left: -9px !important;" type="button" class="transparentButton" @click="deleteSubcon(quotationData.Call_For_Quotation_Subcon_List.subcon_id)"  
              v-if="isPending && quotationData.Call_For_Quotation_Subcon_List.subcon_id !== 1">
                <div class="tooltip" >
                  <span class="tooltiptext" style="margin-bottom: -95px !important;margin-left: -76px;">
                  Delete Quotation</span>
                  <md-icon style="color:orange;margin-top: 10px;">delete</md-icon>
                </div>
              </button>
              <!-- <div class="tooltip" >
                <span class="tooltiptext" style="margin-bottom: -95px !important;margin-right: -6px;" >
                Download Quotation Documents</span>
              
                <md-icon style="color:orange;margin-left: 26px;margin-top: 10px;">folder_open</md-icon>
              </div> -->
              <!-- <button @click="downloadDocument">Download Document</button> -->
            </th>
          </tr>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Element</th>
            <th scope="col">Sub Element</th>
            <th scope="col">Sub Sub Element</th>
            <th scope="col">Description</th>
            <th scope="col">Unit</th>
            <template v-if="!isHide">
              <th v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.cqUnitType.type }}</th>
              <th scope="col">BQ QTY</th>
            </template>
            <th scope="col">(ADJ) QTY</th>
            <th scope="col" colspan="2" v-for="(quotationData, index) in QuotationName" :key="index" style="text-align: center;border:1px solid #ddd !important">
              {{ quotationData.Call_For_Quotation_Subcon_List.Subcon.name }}<br>
            </th>
          </tr>
          <tr>
            <th colspan="6"></th>
            <template v-if="!isHide">
              <th scope="col" v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.cqUnitType.quantity }}</th>
              <th colspan="1"></th>
            </template>
            <th></th>
            <th v-for="(header, index) in generatedHeaders" :key="index" style="text-align: center;border-left:1px solid #ddd !important;border-right:1px solid #ddd !important">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
        <br>
        <tfoot style="line-height: 22px !important;">
        </tfoot>
      </table>
      <br />
    </div>
    <div v-for="(project, index) in projectData" :key="index">
      <template v-if="project.status === 'Pending' && QuotationName.length > 1">
        <div class="confirmation-message">
          <p>Ready to submit cost comparison?</p>
          <button class="btn-save" @click="approvalQuotation">Submit</button>
        </div>
      </template>
      <div>
      <template v-if="project.status === 'Waiting Checking' && QuotationName.length > 0 && (cmAccessApproval || cmAccesslevel)">
        <div class="confirmation-message">
          <template v-if="cqApprovalData.length === 0" >
            <p>Please CM go to project control set up admin approval.</p>
            <a href="projectcontrol">
              <button class="btn-save">Project Control</button>
            </a>
          </template>
          <template v-else>
            <p>Approval / reject cost comparison</p>
            <!--CM approval need to submit the approvalForm-->
            <button class="btn-save" @click="CMsubmitQuotation">Approve</button>
            <!--If CM rejected, need to go back pending -->
            <button class="btn-save" @click="CMrejectedQuotation">Reject</button>
          </template>
        </div>
      </template>
      <template v-if="project.status === 'Waiting Checking' && QuotationName.length > 0 && !cmAccessApproval && !cmAccesslevel ">
        <div class="confirmation-message">
          <p>Waiting CM Approval or Rejected Quotation.</p>
        </div>
      </template>
    </div>
    <template v-if="(project.status === 'Waiting Approval' || project.status === 'Approved') && QuotationName.length > 0 ">
      <div class="cqapprovalBox-container">
        <template ><br>
          <div class="container" style="width: 100%;">
            <div class="row"  v-for="(cmapproval, index) in cmCQapproval" :key="index" style="width: 100%; margin-top: 15px; margin-right: 20px;">
              <div class="cqbox">
                <div class="left-container">
                  <div class="md-card-avatar" style="margin-bottom: 315px;">
                    <img class="img" src="@/assets/img/admin.png" />
                  </div>
                </div>
                <div class="right-container">
                  <div class="user-info">
                    <p class="user-name">Name: {{  cmapproval.user[0].name }}</p>
                  </div>
                  <p style="margin: 8px 0 10px;">Recommend Award To:</p>
                  <p  class="quotation-select" style="background-color: #EFEFEF4D;" disabled>{{ cmapproval.Call_For_Quotation_Subcon_List.Subcon.name }}</p>
                  <p style="margin: 8px 0 10px;">Date:</p>
                  <p  class="quotation-select" style="background-color: #EFEFEF4D;" disabled>{{ formatDate(cmapproval.updatedAt) }}</p>
                  <p style="margin: 8px 0 10px;">Remarks:</p>
                  <p  class="quotation-select" style="background-color: #EFEFEF4D;height: 180px;" disabled>{{ cmapproval.approval_remarks }}</p>
                </div>
              </div>
            </div>
            <div class="row" v-for="(approvalData, index) in filteredCQApprovalData" :key="index" style="width: 100%; margin-top: 15px; margin-right: 20px;">
              <div class="cqbox">
                <div class="left-container">
                  <div class="md-card-avatar" style="margin-bottom: 160px;">
                    <img class="img" src="@/assets/img/admin.png" />
                  </div>
                </div>
                <div class="right-container">
                  <div v-for="(user, userIndex) in approvalData.systemuser" :key="userIndex" class="user-info">
                    <p class="user-name">Name: {{ user.name }}</p>
                    <p class="user-access">Level: {{ user.accesslevel }}</p>
                  </div>
                  <p style="margin: 8px 0 10px;">Recommend Award To:</p>
                  <div v-if="(approvalData.system_user_id === Number(getUserIdLocal) || hasAccess) && index === 0 ">
                    <select v-model="selectedQuotations[index]" class="quotation-select" >
                      <option v-for="(quotationData, qIndex) in SubconListId" :key="qIndex" :value="quotationData.Subcon.name">
                        {{ quotationData.Subcon.name }}
                      </option>
                    </select>
                    <p style="margin: 8px 0 10px;">Remarks:</p>
                    <textarea v-model="remarks[index]" class="remarks-textarea" style="height: 77px !important;" ></textarea>
                    <button class="btn-save"  @click="submitAdminApproval(approvalData.system_user_id, index)">Submit</button><br>
                  </div>
                  <div v-else>
                    <select v-model="selectedQuotations[index]"  style="background-color: #EFEFEF4D;" class="quotation-select" disabled>
                      <option v-for="(quotationData, qIndex) in SubconListId" :key="qIndex" :value="quotationData.Subcon.name">
                        {{ quotationData.Subcon.name }} 
                      </option>
                    </select>
                    <p style="margin: 8px 0 10px;">Remarks:</p>
                    <textarea v-model="remarks[index]" class="remarks-textarea" disabled></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div> 
    <SubmitModal :submit-modal="submitModal"  @editMessage="EditMessage" @fail-message="EditErrorMessage" @close="closesubmitModal" 
    title="Submit Approval" :ApprovalData="ApprovalDataArray" :excelFile="excelFile"></SubmitModal>
    <DelSubcon :del-modal="delModal" @editSubconMessage="EditSubconMessage" @editfail-message="EditErrorMessage" @closeDelete="closeEditModal" :id="deleteId"  title="Delete Subcon"></DelSubcon>
  </div>
</template>

<script>
const XLSX = require('xlsx');
import { ref } from 'vue';
import DescriptionController from '@/services/controllers/DescriptionController.js';
import QuotationController from '@/services/controllers/QuotationController.js';
import CallofQuotationController from '@/services/controllers/CallofQuotationController.js';
import SubmitModal from '@/components/Pop-Up-Modal/SubmitModal.vue';
import DelSubcon from '@/components/Pop-Up-Modal/DelSubcon.vue';
import { checkAccess } from "@/services/axios/accessControl.js";
import _ from 'lodash';
import { axios } from "@/services";

export default {
  components: {
    SubmitModal,
    DelSubcon 
  },
  props: {
    cqId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      documents: [],
      Unittype: [],
      QuotationName: [],
      show: ref(false),
      searchQuery: '',
      isHide: true,
      errorMessage: '',
      editModal: false,
      delModal: false,
      deleteId: [],
      editId: null,
      submitModal: false,
      submitId: null,
      UpdateMessage: null,
      FailMessage: null,
      ApprovalDataArray: [],
      cqApprovalData: [],
      projectData: [],
      selectedQuotations: {},
      remarks: {},
      hasAccess: false,
      cmAccessApproval: false,
      cmCQapproval:[],
      SubconListId:[],
      totalQuotationData:[],
      excelFile: null,
      isLoading: false,
    };
  },
  watch: {
    cqId(newValue, oldValue) {
      this.getDescription(newValue, this.isHide);
      this.getCQApproval(newValue);
      this.getProject(newValue);
      this.checkPermission();
      this.getCMcqApproval(newValue);
    },
  },
  computed: {
    filteredCQApprovalData() {
      const cmSystemUserIds = this.cmCQapproval.map(approval => approval.system_user_id);
      return this.cqApprovalData.filter(approval => !cmSystemUserIds.includes(approval.system_user_id));
    },
    generatedHeaders() {
      const headers = [];
      for (let i = 0; i < this.QuotationName.length; i++) {
        headers.push('Rate', 'Amount');
      }
      return headers;
    },
    latestApprovalData() {
      return this.ApprovalDataArray[this.ApprovalDataArray.length - 1];
    },
    isPending() {
      return this.projectData.some(project => project.status === 'Pending');
    },
    cmAccesslevel() {
      return localStorage?.accesslevel === 'CM';
    },
    getUserIdLocal() {
      return localStorage.getItem('userid');
    },
  },
  methods: {
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
    },
    generateExcelFile() {
      
      const wb = XLSX.utils.book_new();
      
      // Clone the original table
      const originalTable = this.$refs.dataTable;
      const clonedTable = originalTable.cloneNode(true);

      // Remove headers from the cloned table (optional)
      const firstRow = clonedTable.querySelector('thead tr');
      if (firstRow) {
        firstRow.parentNode.removeChild(firstRow);
      }

      // Convert cloned table to worksheet
      const ws = XLSX.utils.table_to_sheet(clonedTable);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

      // Generate Excel file as ArrayBuffer
      const excelFileContent = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

      // Convert ArrayBuffer to Blob
      const blob = new Blob([excelFileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a File from Blob
      const excelFile = new File([blob], 'quotation.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Return the File object
      return excelFile;
    },
    CMsubmitQuotation() {
      this.excelFile = this.generateExcelFile() || null;
      this.submitModal = true;
    },
    async checkPermission() {
      try {
        const permission = await checkAccess(); 
        const accessIds = ['Approved By'];
        const cmapproval = ['Checked By'];
        this.hasAccess = accessIds.some(id => permission.includes(id));

        this.cmAccessApproval = cmapproval.some(id => permission.includes(id));
      } catch (error) {
        this.FailMessage = 'Error checking permission:', error;
      }
    },
    getRowData(rowIndex) {
      const start = rowIndex * 4;
      const end = start + 4;
      return this.cqApprovalData.slice(start, end);
    },
    async submitAdminApproval(systemUserId,index) {
      this.isLoading = true;
      const approvalDataToSubmit = [];
      const selectedSubconListName = this.selectedQuotations[index];
      const remark = this.remarks[index];
      this.SubconListId.forEach((getSubconList) => {
        const subconName = getSubconList.Subcon;
        if (subconName.name === selectedSubconListName) {
          if (selectedSubconListName && remark) {
            approvalDataToSubmit.push({
              cqId: this.cqId,
              userId: systemUserId,
              callForQuotationListId: getSubconList.id,
              remark: remark
            });
          }
        }
      });

      try {
         const SuccessMessage = await QuotationController.addCQApproval(approvalDataToSubmit);
          const concatenatedMessage = SuccessMessage.join(', ');
          const Message = concatenatedMessage.split(',')[0].trim();
          this.UpdateMessage = Message;
          window.scrollTo({
            top: 0,
            behavior: 'smooth' 
          });

          setTimeout(() => {
            this.UpdateMessage = '';
            window.location.reload();
         }, 1000);
      } catch (error) {
        this.isLoading = false;
        this.FailMessage = 'Error while submitting approval data:', error;
      } finally {
        this.isLoading = false;
      }
    },
    editDescription(id) {
      this.editId = id;
      this.editModal = true;
    },
    closeEditModal() {
      this.delModal = false;
    },
    closesubmitModal() {
      this.submitModal = false;
    },
    deleteSubcon(id) {
      const matchedSubcons = [];
      for (const getQuote of this.processedData) {
        const quotation = getQuote.quotation;
        const filteredQuotationIds = [];
        for (const quote of quotation) {
        
          if (quote.Call_For_Quotation_Subcon_List.subcon_id === id) {
            filteredQuotationIds.push(quote.call_for_quotation_subcon_list_id);
          }
        }
        if (filteredQuotationIds.length > 0) {
          matchedSubcons.push(filteredQuotationIds);
        }
      }
      if (matchedSubcons) {
        this.deleteId = matchedSubcons;
        this.delModal = true;
      } else {
        this.FailMessage = 'No matching subcon_id found.';
      }
      this.delModal = true;
    },
    closedelModal() {
      this.delModal = false;
    },
    toggleFilter() {
      this.isHide = !this.isHide;
      this.getDescription(this.cqId, this.isHide);
    },
    filterTable(filterValue) {
      this.isHide = !this.isHide;
    },
    handleInputChange: _.debounce(function(event) {
      this.searchQuery = event.target.value;
      this.getDescription(this.cqId, this.isHide);
    }, 200), 
    async getDescription(id, isHide) {
      try {
        this.isLoading = true;
        let processedData = await DescriptionController.getNewDescription(id);
        const searchQuery = this.searchQuery.toLowerCase().trim();

        this.ApprovalDataArray.push(Number(id));
  
        if (searchQuery) {
          processedData = processedData.filter(formData =>
            formData.description_item.toLowerCase().includes(searchQuery) ||
            formData.element.toLowerCase().includes(searchQuery) ||
            formData.sub_element.toLowerCase().includes(searchQuery) ||
            formData.description_sub_sub_element.toLowerCase().includes(searchQuery)
          );
        }

        const projectStatus = this.projectData;
        if (!Array.isArray(processedData)) {
          processedData = [];
        }

        this.processedData = processedData;
        
        if (processedData.length > 0) {
          const tableBody = document.querySelector('.nested-table tbody');
          tableBody.innerHTML = '';

          let head1Counter = 0;
          let head2Counter = 0;
          

          const totalQuotationAmounts = {};

          for (const formData of processedData) {
            const cqUnitType = formData.cqUnitType;
            this.Unittype = cqUnitType;
            const getQuotation = formData.quotation;
            if (getQuotation.length <= 0 || getQuotation[0].total_quote_amount === 0) {
              head1Counter++;
              const head1Row = document.createElement('tr');
              head1Row.innerHTML = `
                <td><b>${head1Counter}</b></td>
                <td><b>${formData.element || ''}</b></td>
                <td><b>${formData.sub_element || ''}</b></td>
                <td><b>${formData.description_sub_sub_element || ''}</b></td>
                <td style="padding-left:10px !important;white-space: pre-wrap;"><b>${formData.description_item}</b></td>
              `;
              tableBody.appendChild(head1Row);

              head2Counter = 0;
            }

            if (getQuotation.length > 0 && getQuotation[0].total_quote_amount !== 0) {
              head2Counter++;
    
              this.QuotationName = getQuotation;
              
              let quotationTDs = '';
              for (const quotationRate of getQuotation) {
                const SubconId = quotationRate.Call_For_Quotation_Subcon_List.subcon_id;
                const totalQuotation = await DescriptionController.getTotalQuotation(id, SubconId);

                console.log('totalQuotation',totalQuotation);

                this.totalQuotationData = totalQuotation;

                if (!totalQuotationAmounts[SubconId]) {
                  totalQuotationAmounts[SubconId] = totalQuotation;
                } else {
                  totalQuotationAmounts[SubconId] = {
                    ...totalQuotationAmounts[SubconId],
                    ...totalQuotation
                  };
                }

                // if (!this.ApprovalDataArray.some(item => item.callSubconId === quotationRate.call_for_quotation_subcon_list_id)) {
                // this.ApprovalDataArray.push({
                //   cqId: id
                // });
                // }

                quotationTDs += `<td style="text-align:center;border-left:1px solid #ddd !important">${quotationRate.quote_rate}</td>
                                <td style="text-align:right;border-right:1px solid #ddd !important">${ this.formatAccounting(quotationRate.total_quote_amount) }</td>`;
              }
              let unitQuantityTDs = '';
              cqUnitType.forEach((cqUnit) => {
                console.log('cqUnit',cqUnit);
                const quantity = cqUnit.quantity !== undefined ? cqUnit.quantity : 0;
                unitQuantityTDs += `<td style="text-align:center;">${quantity}</td>`;
              });

              const getHideHTML = isHide ? '' : `<td>${formData.bq_quantity}</td>`;
              const unitQuantityHTML = isHide ? '' : unitQuantityTDs;
      
              const head2Row = document.createElement('tr');
              head2Row.innerHTML = `
                <td>${head1Counter}.${head2Counter}</td>
                <td>${formData.element || ''}</td>
                <td>${formData.sub_element || ''}</td>
                <td>${formData.description_sub_sub_element || ''}</td>
                <td style="padding-left:10px !important;white-space: pre-wrap;">${formData.description_item}</td>
                <td>${formData.description_unit || ''}</td>
                ${unitQuantityHTML}
                ${getHideHTML}
                <td>${formData.adj_quantity}</td>
                ${quotationTDs}
              `;
              tableBody.appendChild(head2Row);
            }
          }

          const UnitType = this.Unittype;
          const numberOfArrays = UnitType.length;
          const GetHidenumber = numberOfArrays + 1;

          let bqTotalAmountTDs = '';
          let adjTotalAmountTDs = '';
          let discountGivenTDs = '';
          let afterADJDiscountTDs = '';
          let overrumTDs = '';
          let winnerTDs = '';
          let rateTDs = '';
          let remarks ='';
          for (const subconAmount of Object.values(totalQuotationAmounts)) {
            if (subconAmount[0].subcon_id !== 1) {
              discountGivenTDs += `<td colspan="2">${this.formatAccounting(subconAmount[0].discount_given)}</td>`;
              afterADJDiscountTDs += `<td colspan="2">${this.formatAccounting(subconAmount[0].afterADJDiscount_give)}</td>`;
              overrumTDs += `<td colspan="2">${this.formatAccounting(subconAmount[0].adj_totalSaving)}</td>`;
              winnerTDs += `<td colspan="2" ><b>${this.formatAccounting(subconAmount[0].winner)}</b></td>`;
              rateTDs += `<td colspan="2" >${this.formatAccounting(subconAmount[0].rate)}</td>`;
            }else{
              discountGivenTDs += `<td colspan="2"></td>`;
              afterADJDiscountTDs += `<td colspan="2"></td>`;
              overrumTDs += `<td colspan="2"></td>`;
              winnerTDs += `<td colspan="2" ><b></b></td>`;
              rateTDs += `<td colspan="2" ></td>`;
            }
            bqTotalAmountTDs += `<td colspan="2" >${this.formatAccounting(subconAmount[0].bq_totalAmount)}</td>`;
            adjTotalAmountTDs += `<td colspan="2" >${this.formatAccounting(subconAmount[0].totalSubconAmount)}</td>`;
            remarks += `<td colspan="2" style="white-space: pre-wrap;line-height:25px">${subconAmount[0].remark ? subconAmount[0].remark : ''}</td>`;
          }

          
          const tableFoot = document.querySelector('.nested-table tfoot');
          tableFoot.innerHTML = `
            <tr>
              <td colspan="${isHide ? 7 : GetHidenumber + 7}"><b>BQ Total Amount (RM)</b></td>
              ${bqTotalAmountTDs}
            </tr>
            <tr>
              <td colspan="${isHide ? 7 : GetHidenumber + 7}"><b>ADJ Total Amount (RM)</b></td>
              ${adjTotalAmountTDs}
            </tr>
            <tr>
              <td colspan="${isHide ? 7 : GetHidenumber + 7}"><b>Discount Given (RM)</b></td>
              ${discountGivenTDs}
            </tr>
            <tr>
              <td colspan="${isHide ? 7 : GetHidenumber + 7}"><b>After Discount Given (RM)</b></td>
              ${afterADJDiscountTDs}
            </tr>
            <tr>
              <td colspan="${isHide ? 7 : GetHidenumber + 7}"><b>Total Saving / Overrun (RM)</b></td>
              ${overrumTDs}
            </tr>
            <tr>
              <td colspan="${isHide ? 7 : GetHidenumber + 7}"></td>
              ${rateTDs}
            </tr>
            <tr>
              <td colspan="${isHide ? 7 : GetHidenumber + 7}"></td>
              ${winnerTDs}
            </tr>
            <tr>
              <td colspan="${isHide ? 7 : GetHidenumber + 7}">Remarks</td>
              ${remarks}  
            </tr>
          `;
          
        } else {
          const tableBody = document.querySelector('.nested-table tbody');
          tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No data available.</td></tr>';
        
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = 'An error for get description data.';
      } finally {
        this.isLoading = false;
      }
    },
    formatAccounting(value) {
      if (!value) {
        return '0.00';
      }
      return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    async getCQApproval(id) {
      try {
        const response = await QuotationController.getCQApproval();
        this.cqApprovalData = response;
        response.forEach((approval, index) => {
          const GetSubconList = approval.callForQuotation;
          GetSubconList.forEach((getCQ, cqIndex) => {
            if(getCQ.id === Number(id)){
              const SubconListData = getCQ.Call_For_Quotation_Subcon_Lists;
              this.SubconListId = SubconListData.filter(subconData => subconData.subcon_id !== 1);
              SubconListData.forEach((subconData, subconIndex) => {
              this.$set(this.selectedQuotations, cqIndex, subconData.Subcon.name || '');
              const GetRemarksSubcon = subconData.Cq_Approvals;
              GetRemarksSubcon.forEach((remarkData, remarksIndex) => {
                if(remarkData.system_user_id === approval.system_user_id ){
                  this.$set(this.remarks, index , '');
                }
              
              });
            });
            }
          });
        });
      } catch (error) {
        console.log('Error fetching CQ approvals:', error);
      }
    },
    async getCMcqApproval(id) {
      try {
        const response = await QuotationController.getCMcqApproval(id);
     
        this.cmCQapproval = response.filter(approval => approval.approval_status === 'Approved');
  
      } catch (error) {
        this.FailMessage = 'Error CM approval:', error;
      }
    },
    async getProject(id) {
      try {
        this.projectData = await CallofQuotationController.getDetailCQ(id);
      } catch (error) {
        this.FailMessage = 'Error get project details:', error;
      }
    },
    downloadExcelTemplate() {
      const wb = XLSX.utils.book_new();
      const originalTable = this.$refs.dataTable;
      
      // Clone the original table
      const clonedTable = originalTable.cloneNode(true);

      // Remove the first row containing <th> elements from the cloned table
      const firstRow = clonedTable.querySelector('thead tr');
      if (firstRow) {
        firstRow.parentNode.removeChild(firstRow);
      }

      // Remove the first row containing <td> elements from the cloned table body
      const firstBodyRow = clonedTable.querySelector('tbody tr');
      if (firstBodyRow) {
        firstBodyRow.parentNode.removeChild(firstBodyRow);
      }

      // Remove the first row containing <td> elements from the cloned table footer
      const firstFooterRow = clonedTable.querySelector('tfoot tr');
      if (firstFooterRow) {
        firstFooterRow.parentNode.removeChild(firstFooterRow);
      }

      // Handle hidden elements
      const hiddenElements = clonedTable.querySelectorAll('[style*="display: none"]');
      hiddenElements.forEach(element => {
        element.style.display = '';
      });

      // Convert cloned table to worksheet
      const ws = XLSX.utils.table_to_sheet(clonedTable);
      
      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
      
      // Write workbook to file
      XLSX.writeFile(wb, 'subconComparison.xlsx');

      // Re-hide hidden elements
      hiddenElements.forEach(element => {
        element.style.display = 'none';
      });
    },
    EditMessage(message) {
      this.UpdateMessage = message;
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
      setTimeout(() => {
        this.UpdateMessage = '';
          window.location.reload();
      }, 2000);
    },
    EditSubconMessage(message) {
      this.UpdateMessage = message;
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
      setTimeout(() => {
        this.UpdateMessage = '';
          window.location.reload();
      }, 2000);
    },
    EditErrorMessage(message) {
      this.FailMessage = message;
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
      setTimeout(() => {
        this.FailMessage = '';
          window.location.reload();
      }, 2000);
    },
    async CMrejectedQuotation(){
      try {
        this.UpdateMessage = await QuotationController.CMrejectedQuotation(this.cqId); 
        
        window.scrollTo({
          top: 0,
          behavior: 'smooth' 
        });
        setTimeout(() => {
        this.UpdateMessage = '';
          window.location.reload();
      }, 2000);
      } catch (error) {
        this.FailMessage = "Error rejected quotation: " + error.errorMessage;
        window.scrollTo({
          top: 0,
          behavior: 'smooth' 
        });
          setTimeout(() => {
          this.UpdateMessage = '';
            window.location.reload();
        }, 2000);
      }
    },
    async approvalQuotation(){
      try {
        this.isLoading = true;
        const wb = XLSX.utils.book_new();
        const originalTable = this.$refs.dataTable;
        const clonedTable = originalTable.cloneNode(true);

        const firstRow = clonedTable.querySelector('thead tr');
        if (firstRow) {
          firstRow.parentNode.removeChild(firstRow);
        }
        const firstBodyRow = clonedTable.querySelector('tbody tr');
        if (firstBodyRow) {
          firstBodyRow.parentNode.removeChild(firstBodyRow);
        }
        const firstFooterRow = clonedTable.querySelector('tfoot tr');
        if (firstFooterRow) {
          firstFooterRow.parentNode.removeChild(firstFooterRow);
        }

        const ws = XLSX.utils.table_to_sheet(clonedTable);

        XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

        // Generate Excel file as ArrayBuffer
        const excelFileContent = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
        // Convert ArrayBuffer to Blob
        const blob = new Blob([excelFileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Create a File from Blob
        const getDataFile = new File([blob], 'quotation.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        this.UpdateMessage = await QuotationController.approvalQuotation(this.cqId, getDataFile);
        window.scrollTo({
          top: 0,
          behavior: 'smooth' 
        });
        setTimeout(() => {
          this.UpdateMessage = '';
          window.location.reload();
        }, 2000);

      } catch (error) {
        this.isLoading = false;
        this.FailMessage = 'Error: ' + error.message;
        window.scrollTo({
          top: 0,
          behavior: 'smooth' 
        });
        setTimeout(() => {
          this.UpdateMessage = '';
          window.location.reload();
        }, 2000);
      } finally {
      this.isLoading = false; 
    }
    }
  },
};
</script>

<style>
.nested-table tfoot {
  border-top: 1px solid #bbb;
}

.nested-table tfoot td {
  text-align: right;
  border-right: 1px solid #ddd;
}

.img {
  width: 100px  !important;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

</style>