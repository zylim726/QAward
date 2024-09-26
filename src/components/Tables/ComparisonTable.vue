<template>
  <div>
    <div v-if="isLoading"><loading-modal /><br><br></div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="container" style="margin-top: 20px">
      <div class="search-container" v-if="!isLoading">
        <form class="Searchbar">
          <input type="text" v-model="searchQuery" @input="handleInputChange" placeholder="Search Description....." />
        </form>
      </div>
      <div class="filter-container" v-if="!isLoading">
        <a :href="'revision?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px">Revision</button></a>
        <a :href="'quotation?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px"   v-if="isPending" >Add Quotation</button></a>
        <a :href="'remeasurement?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px"   v-if="isPending" >Edit Qty</button></a>
        <a :href="'description?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px"  v-if="QuotationName.length <= 2">Add Description</button></a>
        <button @click="toggleFilter" class="transparentButton" style="margin-right: 10px" >
          <div class="tooltip" style="width: 178px !important;">
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
    <div class="table-container" style="min-height: 400px;max-height: 925px;">
      <table ref="dataTable" class="nested-table" id="data-table">
        <thead>
          <tr class="header-row-1">
            <th colspan="6"  class="sticky-col"></th>
            <template v-if="!isHide">
              <th scope="col" v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;"></th>
            </template>
            <th></th>
            <th>
              <div class="tooltip" >
                <span class="tooltiptext" style="margin-bottom: -118px !important;margin-left: -142px;width: 210px !important;">
                  ADJ Quantity formula = (Unit Type ADJ Quantity x Description Quantity) x ADJ Factor</span>
                <md-icon style="color: red;margin-top: 10px;margin-right: -10px;">priority_high</md-icon>
              </div>
            </th>
            <th v-if="hasRemeasurement">
              <div class="tooltip" >
                <span class="tooltiptext" style="margin-bottom: -116px !important;margin-left: -107px;width: 229px !important;">
                  Remeasurement Quantity formula = (Unit Type Remeasurement Quantity x Description Quantity) x ADJ Factor</span>
                <md-icon style="color: red;margin-top: 10px;margin-right: -10px;">priority_high</md-icon>
              </div>
            </th>
            <th scope="col" colspan="2" v-for="(quotationData, index) in QuotationName" :key="index" style="text-align: center; border: 1px solid #ddd;">
              <div class="tooltip" style="display: inline-block; margin-right: 10px;">
                <span class="tooltiptext" style="margin-bottom: -107px; margin-left: -167px; width: 178px;">
                  Formula Quotation Rate = ADJ Quantity x Quotation Rate
                </span>
                <md-icon v-if="isPending && quotationData.Call_For_Quotation_Subcon_List.subcon_id > 1.5" style="color: red;">priority_high</md-icon>
              </div>

              <a :href="'editquotation?cqId=' + cqId + '&sbConId=' + quotationData.call_for_quotation_subcon_list_id" v-if="isPending" style="display: inline-block;">
                <button type="button" class="transparentButton" style="padding: 0; margin-right: 5px;">
                  <div class="tooltip" style="display: inline-block;">
                    <span class="tooltiptext" style="margin-bottom: -111px; margin-right: -6px;width: 180px;">
                      Edit Quotation
                    </span>
                    <md-icon style="color: orange;">edit_note</md-icon>
                  </div>
                </button>
              </a>

              <button v-if="isPending && quotationData.Call_For_Quotation_Subcon_List.subcon_id > 1.5" @click="deleteSubcon(quotationData.call_for_quotation_subcon_list_id)" class="transparentButton" style="padding: 0; margin-right: 5px;">
                <div class="tooltip" style="display: inline-block;">
                  <span class="tooltiptext" style="margin-bottom: -95px; margin-left: -76px;">
                    Delete Quotation
                  </span>
                  <md-icon style="color: orange;">delete</md-icon>
                </div>
              </button>

              <button v-if="quotationData.document_api" @click="downloadDocument(quotationData.document_api)" class="transparentButton" style="padding: 0;">
                <div class="tooltip" style="display: inline-block;">
                  <span class="tooltiptext" style="margin-bottom: -95px; margin-left: -76px;">
                    Download Quotation
                  </span>
                  <md-icon style="color: orange;">file_present</md-icon>
                </div>
              </button>
            </th>
          </tr>
          <tr  class="header-row-2">
            <th scope="col"   class="sticky-col">Item</th>
            <th scope="col"   class="sticky-col">Element</th>
            <th scope="col"   class="sticky-col">Sub Element</th>
            <th scope="col"   class="sticky-col">Sub Sub Element</th>
            <th scope="col"   class="sticky-col">Description</th>
            <th scope="col"   class="sticky-col">Unit</th>
            <template v-if="!isHide">
              <th v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.cqUnitType.type }}</th>
            </template>
            <th scope="col">BQ QTY</th>
            <th scope="col">(ADJ) QTY</th>
            <th scope="col" v-if="hasRemeasurement">(Remeasurement) QTY</th>
            <th 
              scope="col" 
              colspan="2" 
              v-for="(quotationData, index) in QuotationName" 
              :key="index" 
              style="text-align: center; border: 1px solid #ddd !important; width: 200px; word-break: break-word; overflow-wrap: break-word;">
              
              {{ getDisplayName(quotationData.Call_For_Quotation_Subcon_List.Subcon.id, quotationData.Call_For_Quotation_Subcon_List.Subcon.name) }}

            </th>
          </tr>
          <tr :class="{
            'header-row-4': Unittype.length > 0 && QuotationName.length === 2, 
            'header-row-3': Unittype.length > 0 && QuotationName.length > 2
          }">
            <th colspan="6"   class="sticky-col"></th>
            <template v-if="!isHide">
              <th scope="col" v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.cqUnitType.quantity }}</th>
            </template>
            <th colspan="2"></th>
            <th v-if="hasRemeasurement"></th>
            <th v-for="(header, index) in generatedHeaders" :key="index" style="text-align: center;border-left:1px solid #ddd !important;border-right:1px solid #ddd !important">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
        <br>
        <tfoot style="line-height: 1px !important;">
        </tfoot>
      </table>
      <br />
    </div>
    <div v-for="(project, index) in projectData" :key="index">
      <template v-if="project.status === 'Pending' && QuotationName.length > 2">
        <div class="confirmation-message">
          <p>Ready to submit cost comparison?</p>
          <button class="btn-save" @click="approvalQuotation">Submit</button>
        </div>
      </template>
      <template v-if="(project.status === 'Waiting Approval') && QuotationName.length > 0 ">
        <div class="confirmation-message" >
          <p>It this a work order.</p> 
          <label >
            <input type="checkbox" :checked="isPermissionChecked" @change="handleCheckboxChange"  >
            Yes
          </label>
        </div>
        <div class="cqapprovalBox-container">   
          <template><br>
            <div class="container" style="width: 100%;">
              <ApprovalTable :cmCQapproval="cmCQapproval" />
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
                    </div>
                    <p style="margin: 8px 0 10px;">Recommend Award To:</p>
                    <div v-if="(approvalData.system_user_id === Number(getUserIdLocal)) && index === 0 ">
                      <select v-model="selectedQuotations[index]" class="quotation-select" >
                        <option v-for="(quotationData, qIndex) in SubconListId" :key="qIndex" :value="quotationData.Subcon.name">
                          {{ quotationData.Subcon.name }}
                        </option>
                      </select>
                      <p style="margin: 8px 0 10px;">Remarks:</p>
                      <textarea v-model="remarks[index]" class="remarks-textarea" style="height: 77px !important;" required ></textarea>
                      <button class="btn-save"  @click="rejectAdminApproval(approvalData.system_user_id, index)">Reject</button><br>
                      <button class="btn-save"  @click="submitAdminApproval(approvalData.system_user_id, index)">Approve</button><br>
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
      <template v-if="(project.status === 'Approved' ) && QuotationName.length > 0 "> 
        <div class="cqapprovalBox-container">
          <ApprovalTable :cmCQapproval="cmCQapproval" />
        </div>
      </template>
  </div> 
    <RejectModal :reject-modal="rejectModal"   @editMessage="EditMessage" @fail-message="EditErrorMessage" @close="closerejectModal" 
    title="Reject Approval" :ApprovalData="ApprovalDataArray"  :excelFile="excelFile"></RejectModal>
    <DelSubcon :del-modal="delModal" @editSubconMessage="EditSubconMessage" @editfail-message="EditErrorMessage" @closeDelete="closeEditModal" :id="deleteId"  title="Delete Subcon"></DelSubcon>
  </div>
</template>


<script>
const XLSX = require('xlsx');
import { ref } from 'vue';
import DescriptionController from '@/services/controllers/DescriptionController.js';
import QuotationController from '@/services/controllers/QuotationController.js';
import CallofQuotationController from '@/services/controllers/CallofQuotationController.js';
import RejectModal from '@/components/Pop-Up-Modal/RejectModal.vue';
import ApprovalTable from '@/components/Tables/ApprovalTable.vue';
import DelSubcon from '@/components/Pop-Up-Modal/DelSubcon.vue';
import { checkAccess } from "@/services/axios/accessControl.js";
import _ from 'lodash';
import {  config } from "@/services";
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; 

export default {
  components: {
    DelSubcon,
    RejectModal,
    LoadingModal,
    ApprovalTable
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
      delModal: false,
      deleteId: [],
      rejectModal: false,
      UpdateMessage: null,
      FailMessage: null,
      ApprovalDataArray: [],
      cqApprovalData: [],
      projectData: [],
      selectedQuotations: {},
      remarks: {},
      hasAccess: false,
      cmCQapproval:[],
      SubconListId:[],
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
      this.handleCheckboxChange();
    },
  },
  computed: {
    hasRemeasurement(){   
      if (Array.isArray(this.Unittype) && this.Unittype.length > 0) {
        const firstUnit = this.Unittype[0];
        const remeasurementQuantity = firstUnit?.is_remeasurement;
        return remeasurementQuantity === true;
      }
      return false;
    },
    isPermissionChecked() {
      const isChecked = this.Unittype[0].Cq_Unit_Type.Call_For_Quotation.is_work_order === true;
      return isChecked;
    },
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
   async downloadDocument(url) {
      try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const fullUrl = `${apiHost}${url}`;

        const response = await fetch(fullUrl, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element, set its href to the blob URL, and click it to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = ''; // This will use the default filename from the server
        link.click();

        // Clean up
        URL.revokeObjectURL(blobUrl);

      } catch (error) {
        this.errorMessage = "Error issue: download document failed: " + error.message;
        console.error(this.errorMessage);
      }
    },
    async handleCheckboxChange() {
       if (event && event.target) {
        const isChecked = event.target.checked; 
        try {
          const SuccessMessage = await QuotationController.updateWorkOrder(isChecked,this.cqId);
        } catch (error) {
          
        }
       }
    },
    getDisplayName(budgetId, name) {
      budgetId = parseFloat(budgetId);
      if (isNaN(budgetId)) {
        return name; 
      }
      if (budgetId === 1) {
        return 'Budget ADJ';
      }
      return name; // Default case
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
    },
    generateExcelFile() {
      
      const wb = XLSX.utils.book_new();
    
      const originalTable = this.$refs.dataTable;
      const clonedTable = originalTable.cloneNode(true);

      const firstRow = clonedTable.querySelector('thead tr');
      if (firstRow) {
        firstRow.parentNode.removeChild(firstRow);
      }
      const ws = XLSX.utils.table_to_sheet(clonedTable);

      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

      const excelFileContent = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      const blob = new Blob([excelFileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const excelFile = new File([blob], 'quotation.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      return excelFile;
    },
    async checkPermission() {
      try {
        const permission = await checkAccess(); 
        const accessIds = ['Submit Approved'];
        this.hasAccess = accessIds.some(id => permission.includes(id));
      } catch (error) {
        this.FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
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
          if (selectedSubconListName) {
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
          window.scrollTo({
            top: 0,
            behavior: 'smooth' 
          });
          

          const SuccessMessage = await QuotationController.addCQApproval(approvalDataToSubmit);
          const concatenatedMessage = SuccessMessage.join(', ');
          const Message = concatenatedMessage.split(',')[0].trim();
          this.UpdateMessage = Message;
        
          setTimeout(() => {
            this.UpdateMessage = '';
            window.location.reload();
         }, 1000);
      } catch (error) {
        this.isLoading = false;
        this.FailMessage = 'Error message : Erro while submitting approval data:', error;
      } finally {
        this.isLoading = false;
      }
    },
    async rejectAdminApproval(systemUserId,index) {
      this.isLoading = true;
      const approvalDataToSubmit = [];
      const remark = this.remarks[index];

      this.SubconListId.forEach((getSubconList) => {
        approvalDataToSubmit.push({
          cqId: this.cqId,
          userId: systemUserId,
          callForQuotationListId: getSubconList.id,
          remark: remark || "" 
        });
      });

      try {
        
          window.scrollTo({
            top: 0,
            behavior: 'smooth' 
          });

          const SuccessMessage = await QuotationController.rejectCQApproval(approvalDataToSubmit);
          const concatenatedMessage = SuccessMessage.join(', ');
          const Message = concatenatedMessage.split(',')[0].trim();
          this.UpdateMessage = Message;
         
          setTimeout(() => {
            this.UpdateMessage = '';
            window.location.reload();
         }, 1000);
      } catch (error) {
         this.isLoading = false;
          window.scrollTo({
              top: 0,
            behavior: 'smooth' 
          });

          setTimeout(() => {
            this.FailMessage = '';
            window.location.reload();
         }, 1000);
      } finally {
        this.isLoading = false;
      }
    },
    closerejectModal(){
      this.rejectModal = false;
    },
    closeEditModal(){
      this.delModal = false;
    },
    deleteSubcon(id) {
      this.deleteId = id;
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
    }, 900), 
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

        if (!Array.isArray(processedData)) {
          processedData = [];
        }
        this.processedData = processedData;

        if (processedData.length > 0) {
          const tableBody = document.querySelector('.nested-table tbody');
          tableBody.innerHTML = '';

          let head1Counter = 0;
          let head2Counter = 0;

          let maxLength = 0;
          let maxQuotation = [];
          for (const formData of processedData) {
            const getQuotation = formData.quotation;
            
            this.Unittype = formData.cqUnitType;

            if (getQuotation.length <= 0 || parseFloat(formData.adj_quantity) === 0.00 ) {
              head1Counter++;
             
              const head1Row = document.createElement('tr');
              head1Row.innerHTML = `
                <td  class="sticky-col"><b><u>${head1Counter}</u></b></td>
                <td  class="sticky-col"><b><u>${formData.element || ''}</u></b></td>
                <td  class="sticky-col"><b><u>${formData.sub_element || ''}</u></b></td>
                <td  class="sticky-col"><b><u>${formData.description_sub_sub_element || ''}</u></b></td>
                <td style="padding-left:10px !important" class="sticky-col td-max-width"><b><u>${formData.description_item}</u></b></td>
              `;
              tableBody.appendChild(head1Row);

              head2Counter = 0;

              
            }

            if (getQuotation.length > 0 && parseFloat(formData.adj_quantity) !== 0.00) {
         
              head2Counter++;
              if (getQuotation.length > maxLength) {
                  maxLength = getQuotation.length;
                  maxQuotation = [getQuotation]; 
              }


              let quotationTDs = '';
              for (const quotationRate of getQuotation) {
          
                quotationTDs += `<td style="text-align:center;border-left:1px solid #ddd !important">${this.formatAccounting(quotationRate.quote_rate)}</td>
                                <td style="text-align:right;border-right:1px solid #ddd !important">${this.formatAccounting(quotationRate.total_quote_amount)}</td>`;
              }
              let unitQuantityTDs = '';
              formData.cqUnitType.forEach((cqUnit) => {
                unitQuantityTDs += `<td style="text-align:center;">${this.formatAccounting(cqUnit.adj_quantity)}</td>`;
              });

              let remeasuremntQuantityTDs = '';
              if (formData.remeasurement_quantity >= 0) {
                remeasuremntQuantityTDs = `<td>${this.formatAccounting(formData.remeasurement_quantity)}</td>`;
              }


              const getHideHTML = `<td>${this.formatAccounting(formData.bq_quantity)}</td>`;
              const unitQuantityHTML = isHide ? '' : unitQuantityTDs;

              const head2Row = document.createElement('tr');
              head2Row.innerHTML = `
                <td class="sticky-col" >${head1Counter}.${head2Counter}</td>
                <td class="sticky-col">${formData.element || ''}</td>
                <td class="sticky-col">${formData.sub_element || ''}</td>
                <td class="sticky-col">${formData.description_sub_sub_element || ''}</td>
                <td style="padding-left:10px !important;" class="sticky-col td-max-width">${formData.description_item}</td>
                <td>${formData.description_unit || ''}</td>
                ${unitQuantityHTML}
                ${getHideHTML}
                <td>${this.formatAccounting(formData.adj_quantity)}</td>
                ${remeasuremntQuantityTDs}
                ${quotationTDs}
              `;
              tableBody.appendChild(head2Row);
            }
          }

          this.QuotationName = maxQuotation.length > 0 ? maxQuotation[0] : [];
          const UnitType = this.Unittype;
          const numberOfArrays = UnitType.length;
          const getRemeauserement = UnitType[0].is_remeasurement;

          const colspan = isHide
            ? (getRemeauserement ? 9 : 8)
            : (getRemeauserement ? numberOfArrays + 9 : numberOfArrays + 8);

          let bqTotalAmountTDs = '';
          let adjTotalAmountTDs = '';
          let discountGivenTDs = '';
          let afterADJDiscountTDs = '';
          let remasurementTotalAmountTDs = '';
          let previsionalSumTDs = '';
          let overrumTDs = '';
          let winnerTDs = '';
          let rateTDs = '';
          let remarks = '';
          for (const DatasubconAmount of this.QuotationName) {
             const SubconId = DatasubconAmount.call_for_quotation_subcon_list_id;
             const totalQuotation = await DescriptionController.getTotalQuotation(id, SubconId);
            if (totalQuotation[0].subcon_id > 1.5) {
              discountGivenTDs += `<td colspan="2">${this.formatAccounting(totalQuotation[0].discount_given)}</td>`;
              afterADJDiscountTDs += `<td colspan="2">${this.formatAccounting(totalQuotation[0].afterADJDiscount_give)}</td>`;
              overrumTDs += `<td colspan="2">${this.formatAccounting(totalQuotation[0].adj_totalSaving)}</td>`;
              winnerTDs += `<td colspan="2" ><b>${ totalQuotation[0].winner }</b></td>`;
              rateTDs += `<td colspan="2" >${ totalQuotation[0].rate }</td>`;
              previsionalSumTDs += `<td colspan="2" >${this.formatAccounting(totalQuotation[0].provisional_sum)}</td>`;
            } else {
              discountGivenTDs += `<td colspan="2"></td>`;
              afterADJDiscountTDs += `<td colspan="2"></td>`;
              overrumTDs += `<td colspan="2"></td>`;
              winnerTDs += `<td colspan="2" ><b></b></td>`;
              rateTDs += `<td colspan="2" ></td>`;
              previsionalSumTDs +=  `<td colspan="2" ></td>`;
            }

            if (totalQuotation[0].subcon_id === 0.5 || totalQuotation[0].subcon_id > 1.5){
              bqTotalAmountTDs += `<td colspan="2" >${this.formatAccounting(totalQuotation[0].bq_totalAmount)}</td>`;
            }else {
              bqTotalAmountTDs +=  `<td colspan="2" ></td>`;
            }

            if (totalQuotation[0].subcon_id === 1.0 || totalQuotation[0].subcon_id > 1.5){
              adjTotalAmountTDs += `<td colspan="2" >${this.formatAccounting(totalQuotation[0].totalSubconAmount)}</td>`;
            }else {
              adjTotalAmountTDs +=  `<td colspan="2" ></td>`;
            }


            if (totalQuotation[0].subcon_id === 1.5 || totalQuotation[0].subcon_id > 1.5){
              remasurementTotalAmountTDs += `<td colspan="2" >${this.formatAccounting(totalQuotation[0].remeasurement_totalAmount)}</td>`;
            }else {
              remasurementTotalAmountTDs +=  `<td colspan="2" ></td>`;
            }

            remarks += `<td colspan="2" style="white-space: pre-wrap;line-height:25px">${totalQuotation[0].remark ? totalQuotation[0].remark : ''}</td>`;
          }

          const tableFoot = document.querySelector('.nested-table tfoot');
          tableFoot.innerHTML = `
            <tr>
              <td colspan="${colspan}" title="BQ Qty x  Rate "><b>BQ Total Amount (RM)</b></td>
              ${bqTotalAmountTDs}
            </tr>
            <tr>
              <td colspan="${colspan}" title="ADJ Qty x Rate "><b>ADJ Total Amount (RM)</b></td>
              ${adjTotalAmountTDs}
            </tr>
            <tr>
              <td colspan="${colspan}" title="Remeasurement Qty x Rate"><b>Remeasurement Total Amount (RM)</b></td>
              ${remasurementTotalAmountTDs}
            </tr>
            <tr>
              <td colspan="${colspan}" ><b>Discount Given (RM)</b></td>
              ${discountGivenTDs}
            </tr>
            <tr>
              <td colspan="${colspan}" title="ADJ Total Amount - Discount"><b>After Discount Given (RM)</b></td>
              ${afterADJDiscountTDs}
            </tr>
            <tr>
              <td colspan="${colspan}" title="Budget  ADJ Total Amount - After Discount Given"><b>Total Saving / Overrun (RM)</b></td>
              ${overrumTDs}
            </tr>
            <tr>
              <td colspan="${colspan}" title="Total Saving  / Budget ADJ Total Amount * 100%"><b>Total Saving / Overrun (%)</b></td>
              ${rateTDs}
            </tr>
            <tr>
              <td colspan="${colspan}"><b>Ranking</b></td>
              ${winnerTDs}
            </tr>
            <tr>
              <td colspan="${colspan}" title="BQ Total Amount - After Discount Given"><b>Provisional Sum (RM)</b></td>
              ${previsionalSumTDs}
            </tr>
            <tr>
              <td colspan="${colspan}"><b>Remarks</b></td>
              ${remarks}
            </tr>
          `;

 
          this.$nextTick(() => {
            tippy('.nested-table [title]', {
              content: (reference) => reference.getAttribute('title'),
              placement: 'right',
              theme: 'custom',
            });
          });


        } else {
          const tableBody = document.querySelector('.nested-table tbody');
          tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No data available.</td></tr>';
        }
      } catch (error) {
        this.FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
      } finally {
        this.isLoading = false;
      }
    },
    formatAccounting(value) {
      if (value == null || isNaN(value) && !this.isNegativeFormatted(value)) {
        return '0.00';
      }

      if (this.isNegativeFormatted(value)) {
        const numericValue = parseFloat(value.replace(/[()]/g, '').trim()) * -1;
        return `(${Math.abs(numericValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
      }

      const parsedValue = parseFloat(value);
      return parsedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    isNegativeFormatted(value) {
      return typeof value === 'string' && value.startsWith('(') && value.endsWith(')');
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
    async getCMcqApproval() {
      try {
        const id = this.cqId;
        const response = await QuotationController.getCMcqApproval(id);
        this.cmCQapproval = response.filter(approval => approval.approval_status === 'Approved');
      } catch (error) {
         //this.FailMessage = 'Error CM approval:', error;
      }
    },
    async getProject(id) {
      try {
        this.projectData = await CallofQuotationController.getDetailCQ(id);
      } catch (error) {
        this.FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
      }
    },
    downloadExcelTemplate() {
      const wb = XLSX.utils.book_new();
      const originalTable = this.$refs.dataTable;
      const clonedTable = originalTable.cloneNode(true);

      // Remove the first row of <thead> if it exists
      const firstRow = clonedTable.querySelector('thead tr');
      if (firstRow) {
        firstRow.parentNode.removeChild(firstRow);
      }

      // Ensure the first row of <tbody> is not removed
      const firstBodyRow = clonedTable.querySelector('tbody tr');
      if (firstBodyRow) {
        firstBodyRow.parentNode.removeChild(firstBodyRow);
      }

      // Preserve the <tfoot> section entirely
      const tfoot = clonedTable.querySelector('tfoot');
      if (tfoot) {
        const allFootRows = Array.from(tfoot.querySelectorAll('tr'));
        allFootRows.forEach(row => {
          row.style.display = '';
        });
      }

      const hiddenElements = clonedTable.querySelectorAll('[style*="display: none"]');
      hiddenElements.forEach(element => {
        element.style.display = '';
      });

      const ws = XLSX.utils.table_to_sheet(clonedTable);
      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

      XLSX.writeFile(wb, 'subconComparison.xlsx');

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
      this.excelFile = this.generateExcelFile() || null;
      this.rejectModal = true;
    },
    async approvalQuotation(){
      try {
        this.isLoading = true; 
        window.scrollTo({
          top: 0,
          behavior: 'smooth' 
        });

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

        const excelFileContent = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
        const blob = new Blob([excelFileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const getDataFile = new File([blob], 'quotation.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });


        this.UpdateMessage = await QuotationController.approvalQuotation(this.cqId, getDataFile);
        
        setTimeout(() => {
          this.UpdateMessage = '';
          window.location.reload();
        }, 2000);

      } catch (error) {
        this.isLoading = false;
        this.FailMessage = 'Error Message: ' + error.errorMessage;
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
  padding-right: 10px;
}

.img {
  width: 100px  !important;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}


.header-row-2 th {
  position: sticky;
  top: 55px;
  height: 48px;
}

.header-row-3 th {
  position: sticky;
  top: 109px;
  z-index: 11; 
}

.header-row-4 th {
  position: sticky;
  top: 88px;
  z-index: 11; 
}

.tippy-box[data-theme~='custom'] {
  background-color: #FFE5B4; /* Change background color */
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  color: black;
}

/* Optional: Arrow styling */
.tippy-box[data-theme~='custom'] .tippy-arrow {
  color: #FFE5B4; 
}

</style>
