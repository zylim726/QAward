<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="container" style="margin-top: 20px">
      <div class="search-container">
        <form class="Searchbar">
          <input type="text" v-model="searchQuery" placeholder="Search Description....." />
        </form>
      </div>
      <div class="filter-container">
        <a href="revision"><button type="button" class="btn-save" style="margin-right: 10px">Revision</button></a>
        <a :href="'quotation?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px">Add Quotation</button></a>
        <a :href="'description?cqId=' + cqId"><button type="button" class="btn-save" style="margin-right: 10px">Add Description</button></a>
        <button @click="toggleFilter" class="transparentButton" style="margin-right: 10px">
          <md-icon class="mdIcon">{{ isHide ? 'visibility_off' : 'visibility' }}</md-icon>
        </button>
        <button type="button" class="transparentButton" style="margin-right: 10px" @click="downloadExcelTemplate">
          <md-icon class="mdIcon">system_update_alt</md-icon>
        </button>
      </div>
    </div>
    <div class="table-container">
      <table class="nested-table" id="data-table">
        <thead>
          <tr>
            <th scope="col">Action</th>
            <th scope="col">Item</th>
            <th scope="col">Element</th>
            <th scope="col">Sub Element</th>
            <th scope="col">Sub Sub Element</th>
            <th scope="col">Description</th>
            <th scope="col">Unit</th>
            <template v-if="!isHide">
              <th v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.cqUnitType.type }}</th>
              <th scope="col">BQ QTY</th>
              <th scope="col">(ADJ) QTY</th>
            </template>
            <th scope="col" colspan="2" v-for="(quotationData, index) in QuotationName" :key="index" style="text-align: center;border:1px solid #ddd !important">
              {{ quotationData.Call_For_Quotation_Subcon_List.Subcon.name }}
              <a :href="'editquotation?cqId=' + cqId + '&sbConId=' + quotationData.Call_For_Quotation_Subcon_List.subcon_id">
                  <button type="button" class="transparentButton" >
                    <md-icon style="color:orange;font-size: 34px !important;">edit_note</md-icon>
                  </button>
              </a>
              </th>
          </tr>
          <tr>
            <th></th>
            <th colspan="6"></th>
            <template v-if="!isHide">
              <th scope="col" v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.cqUnitType.quantity }}</th>
              <th colspan="2"></th>
            </template>
            <th v-for="(header, index) in generatedHeaders" :key="index" style="text-align: center;border-left:1px solid #ddd !important;border-right:1px solid #ddd !important">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
        <br>
        <tfoot style="line-height: 2px !important;">
        </tfoot>
      </table>
      <br />
    </div>
    <div v-for="(project, index) in projectData" :key="index">
      <template v-if="project.status === 'Pending' && QuotationName.length > 0">
        <div class="confirmation-message">
          <p>Are you sure you want to submit the quotation?</p>
          <button class="btn-save" @click="submitQuotation">Submit</button>
        </div>
      </template>
      <template v-if="project.status === 'Waiting Approval' && QuotationName.length > 0">
        <div class="confirmation-message">
          <p>Is this quotation acceptable for approval?</p>
          <button class="btn-save" @click="approvalQuotation">Approval</button>
          <button class="btn-save" @click="rejectedQuotation" >Rejected</button>
        </div>
      </template> 
    <template v-if="project.status === 'Approval' && QuotationName.length > 0">
      <div class="cqapprovalBox-container">
        <template v-if="cqApprovalData.length === 0">
          <div class="confirmation-message" style="width: 100% !important;">
            <p>Please go to project control and get admin approval.</p>
            <a href="projectcontrol">
              <button class="btn-save">Project Control</button>
            </a>
          </div>
        </template>
        <template v-else><br>
          <div class="row" v-for="(approvalData, index) in cqApprovalData" :key="index" style="width: 100%; margin-top: 15px; margin-right: 20px;">
            <div class="cqbox">
              <div class="left-container">
                <div class="md-card-avatar">
                  <img class="img" src="@/assets/img/admin.png" />
                </div>
              </div>
              <div class="right-container">
                <div v-for="user in approvalData.systemuser" :key="user.id" class="user-info">
                  <p class="user-name">Name: {{ user.name }}</p>
                  <p class="user-access">Level: {{ user.accesslevel }}</p>
                </div>
                <p style="margin: 8px 0 10px;">Quotation:</p>
                <select v-model="selectedQuotations[index]" class="quotation-select">
                  <option v-for="(quotationData, qIndex) in filteredQuotationName" :key="qIndex" :value="quotationData.call_for_quotation_subcon_list_id">
                    {{ quotationData.Call_For_Quotation_Subcon_List.Subcon.name }}
                  </option>
                </select>
                <p style="margin: 8px 0 10px;">Remarks:</p>
                <textarea v-model="remarks[approvalData.id]" class="remarks-textarea"></textarea>
              </div>
            </div>
          </div>
        </template>
      </div>
      <button class="btn-save" @click="submitAdminApproval">Submit</button><br>
    </template>
  </div> 
    <EditDescription :edit-modal="editModal" @editMessage="EditMessage" @editfail-message="EditErrorMessage" @close="closeEditModal" :id="editId" title="Edit Description"></EditDescription>
    <SubmitModal :submit-modal="submitModal"  @editMessage="EditMessage" @fail-message="EditErrorMessage" @close="closesubmitModal" title="Submit Approval" :ApprovalData="ApprovalDataArray"></SubmitModal>
  </div>
</template>

<script>
import { ref } from 'vue';
import DescriptionController from '@/services/controllers/DescriptionController.js';
import QuotationController from '@/services/controllers/QuotationController.js';
import CallofQuotationController from '@/services/controllers/CallofQuotationController.js';
import EditDescription from '@/components/Pop-Up-Modal/EditDescription.vue';
import SubmitModal from '@/components/Pop-Up-Modal/SubmitModal.vue';
import * as XLSX from 'xlsx';

export default {
  components: {
    EditDescription,
    SubmitModal,
  },
  props: {
    cqId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      Unittype: [],
      QuotationName: [],
      show: ref(false),
      searchQuery: '',
      isHide: true,
      errorMessage: '',
      editModal: false,
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
    };
  },
  watch: {
    cqId(newValue, oldValue) {
      this.getDescription(newValue, this.isHide);
      this.getCQApproval();
      this.getProject(newValue);
      this.getCQdetailsApproval(newValue);
    },
  },
  computed: {
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
    filteredQuotationName() {
      return this.QuotationName.filter(quotationData => quotationData.Call_For_Quotation_Subcon_List.subcon_id !== 1);
    }
  },
  methods: {
    getRowData(rowIndex) {
      const start = rowIndex * 4;
      const end = start + 4;
      return this.cqApprovalData.slice(start, end);
    },
    async submitAdminApproval() {
      const approvalDataToSubmit = this.cqApprovalData.map((approvalData, index) => {
        const selectedSubconListId = this.selectedQuotations[index];

        return {
          cqId: this.cqId,
          userId: approvalData.system_user_id,
          SubconListId: selectedSubconListId,
          remark: this.remarks[approvalData.id]
        };
      });

      try {
        const SuccessMessage = await QuotationController.addCQApproval(approvalDataToSubmit);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.UpdateMessage = Message;
      } catch (error) {
        console.error('Error while submitting approval data:', error);
      }
    },
    editDescription(id) {
      this.editId = id;
      this.editModal = true;
    },
    closeEditModal() {
      this.editModal = false;
    },
    closesubmitModal() {
      this.submitModal = false;
    },
    toggleFilter() {
      this.isHide = !this.isHide;
      this.getDescription(this.cqId, this.isHide);
    },
    filterTable(filterValue) {
      this.isHide = !this.isHide;
    },
    async getDescription(id, isHide) {
      try {
        let processedData = await DescriptionController.getNewDescription(id);

        if (!Array.isArray(processedData)) {
          processedData = [];
        }

        this.processedData = processedData;
        
        if (processedData.length > 0) {
          const tableBody = document.querySelector('.nested-table tbody');
          tableBody.innerHTML = '';

          let head1Counter = 0;
          let head2Counter = 0;
          let ApprovalDataArray = [];

          const totalQuotationAmounts = {};

          for (const formData of processedData) {
            const cqUnitType = formData.cqUnitType;
            this.Unittype = cqUnitType;
            const getQuotation = formData.quotation;

            if (getQuotation.length <= 0 || getQuotation[0].total_quote_amount === 0) {
              head1Counter++;
              const head1Row = document.createElement('tr');
              head1Row.innerHTML = `
                <td><button class="edit-button" data-formid="${formData.id}">Edit</button></td>
                <td><b>${head1Counter}</b></td>
                <td><b>${formData.element || ''}</b></td>
                <td><b>${formData.sub_element || ''}</b></td>
                <td><b>${formData.description_sub_sub_element || ''}</b></td>
                <td><b>${formData.description_item}</b></td>
              `;
              tableBody.appendChild(head1Row);

              head1Row.querySelector('.edit-button').addEventListener('click', (event) => {
                const formId = event.target.dataset.formid;
                this.editDescription(formId);
              });
              head2Counter = 0;
            }

            if (getQuotation.length > 0 && getQuotation[0].total_quote_amount !== 0) {
              head2Counter++;
    
              this.QuotationName = getQuotation;

              let quotationTDs = '';
              for (const quotationRate of getQuotation) {
                const SubconId = quotationRate.Call_For_Quotation_Subcon_List.subcon_id;
                const totalQuotation = await DescriptionController.getTotalQuotation(id, SubconId);
      
                this.totalQuotationData = totalQuotation;

                if (!totalQuotationAmounts[SubconId]) {
                  totalQuotationAmounts[SubconId] = totalQuotation;
                } else {
                  totalQuotationAmounts[SubconId] = {
                    ...totalQuotationAmounts[SubconId],
                    ...totalQuotation
                  };
                }

                if (!this.ApprovalDataArray.some(item => item.callSubconId === quotationRate.call_for_quotation_subcon_list_id)) {
                this.ApprovalDataArray.push({
                  cqId: id,
                  callSubconId: quotationRate.call_for_quotation_subcon_list_id
                });
                }
                quotationTDs += `<td style="text-align:center;border-left:1px solid #ddd !important">${quotationRate.quote_rate}</td>
                                <td style="text-align:right;border-right:1px solid #ddd !important">${quotationRate.total_quote_amount}</td>`;
              }
              let unitQuantityTDs = '';
              cqUnitType.forEach((cqUnit) => {
                unitQuantityTDs += `<td style="text-align:center;">${cqUnit.quantity}</td>`;
              });

              const getHideHTML = isHide ? '' : `<td>${formData.bq_quantity}</td><td>${formData.adj_quantity}</td>`;
              const unitQuantityHTML = isHide ? '' : unitQuantityTDs;
      
              const head2Row = document.createElement('tr');
              head2Row.innerHTML = `
                <td><button class="edit-button" data-formid="${formData.id}">Edit</button></td>
                <td>${head1Counter}.${head2Counter}</td>
                <td>${formData.element || ''}</td>
                <td>${formData.sub_element || ''}</td>
                <td>${formData.description_sub_sub_element || ''}</td>
                <td style="padding-left:60px !important;">${formData.description_item}</td>
                <td>${formData.description_unit || ''}</td>
                ${unitQuantityHTML}
                ${getHideHTML}
                ${quotationTDs}
              `;
              tableBody.appendChild(head2Row);
              head2Row.querySelector('.edit-button').addEventListener('click', (event) => {
                const formId = event.target.dataset.formid;
                this.editDescription(formId);
              });
            }
          }
          let bqTotalAmountTDs = '';
          let adjTotalAmountTDs = '';
          let discountGivenTDs = '';
          let afterADJDiscountTDs = '';
          let overrumTDs = '';
          let winnerTDs = '';
          let rateTDs = '';
          for (const subconAmount of Object.values(totalQuotationAmounts)) {
            bqTotalAmountTDs += `<td colspan="2" >${subconAmount[0].bq_totalAmount}</td>`;
            adjTotalAmountTDs += `<td colspan="2" >${subconAmount[0].totalSubconAmount}</td>`;
            discountGivenTDs += `<td colspan="2" >${subconAmount  [0].discount_given}</td>`;
            afterADJDiscountTDs += `<td colspan="2" >${subconAmount[0].afterADJDiscount_give}</td>`;
            overrumTDs += `<td colspan="2" >${subconAmount[0].adj_totalSaving}</td>`;
            winnerTDs += `<td colspan="2" ><b>${subconAmount[0].winner}</b></td>`;
            rateTDs += `<td colspan="2" >${subconAmount[0].rate}</td>`;
          }

          const getHideHTML = isHide ? '' : `<td colspan="4"></td>`;
        
          const tableFoot = document.querySelector('.nested-table tfoot');
          tableFoot.innerHTML = `
            <tr>
              ${getHideHTML}
              <td colspan="7"><b>BQ Total Amount (RM)</b></td>
              ${bqTotalAmountTDs}
            </tr>
            <tr>
              ${getHideHTML}
              <td colspan="7"><b>ADJ Total Amount (RM)</b></td>
              ${adjTotalAmountTDs}
            </tr>
            <tr>
              ${getHideHTML}
              <td colspan="7" ><b>Discount Given (RM)</b></td>
              ${discountGivenTDs}
            </tr>
            <tr>
              ${getHideHTML}
              <td colspan="7" ><b>After Discount Given (RM)</b></td>
              ${afterADJDiscountTDs}
            </tr>
            <tr>
              ${getHideHTML}
              <td colspan="7" ><b>Total Saving / Overrun (RM)</b></td>
              ${overrumTDs}
            </tr>
            <tr>
              ${getHideHTML}
              <td colspan="7" ></td>
              ${rateTDs}
            </tr>
            <tr>
              ${getHideHTML}
              <td colspan="7" ></td>
              ${winnerTDs}
            </tr>
          `;
          
        } else {
          const tableBody = document.querySelector('.nested-table tbody');
          tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No data available.</td></tr>';
        
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        this.errorMessage = 'An error occurred while fetching data.';
      }
    },
    async getCQApproval() {
      try {
        const response = await QuotationController.getCQApproval();
        this.cqApprovalData = response;
      } catch (error) {
        this.FailMessage = 'Error fetching CQ Approval data:', error;
      }
    },
    async getProject(id) {
      try {
        this.projectData = await CallofQuotationController.getDetailCQ(id);
      } catch (error) {
        this.FailMessage = 'Error fetching CQ Approval data:', error;
      }
    },
    downloadExcelTemplate() {
      const wb = XLSX.utils.book_new();
      const clonedTable = document.querySelector('#data-table').cloneNode(true);

      clonedTable.querySelectorAll('.edit_note').forEach(icon => {
        icon.parentNode.removeChild(icon);
      });

      clonedTable.querySelectorAll('tfoot tr').forEach(row => {
        const firstCell = row.cells[0];
        if (firstCell && firstCell.getAttribute('colspan') === '7') {
          firstCell.setAttribute('colspan', '7');
        }
      });

      const ws = XLSX.utils.table_to_sheet(clonedTable);
      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
      XLSX.writeFile(wb, 'comparisonTable.xlsx');
    },
    EditMessage(message) {
      this.UpdateMessage = message;
      setTimeout(() => {
        this.UpdateMessage = '';
        window.scrollTo(0, 0);
        window.location.reload();
      }, 2000);
    },
    EditErrorMessage(message) {
      this.FailMessage = message;
      setTimeout(() => {
        this.FailMessage = '';
        window.scrollTo(0, 0);
        window.location.reload();
      }, 2000);
    },
    submitQuotation() {
      this.submitModal = true;
    },
    async rejectedQuotation(){
      try {
        this.UpdateMessage = await QuotationController.rejectedQuotation(this.cqId); 
        setTimeout(() => {
        this.UpdateMessage = '';
        window.scrollTo(0, 0);
        window.location.reload();
      }, 2000);
      } catch (error) {
        this.FailMessage = "Error updating access permission: " + error.errorMessage;
        setTimeout(() => {
        this.UpdateMessage = '';
        window.scrollTo(0, 0);
        window.location.reload();
      }, 2000);
      }
    },
    generateExcelTemplate() {
      const wb = XLSX.utils.book_new();
      const clonedTable = document.querySelector('#data-table').cloneNode(true);

      clonedTable.querySelectorAll('.edit_note').forEach(icon => {
        icon.parentNode.removeChild(icon);
      });

      clonedTable.querySelectorAll('tfoot tr').forEach(row => {
        const firstCell = row.cells[0];
        if (firstCell && firstCell.getAttribute('colspan') === '7') {
          firstCell.setAttribute('colspan', '7');
        }
      });

      const ws = XLSX.utils.table_to_sheet(clonedTable);
      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

      const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
      const filename = `revision-${todayDate}.xlsx`;

      // Save the Excel file and trigger download
      XLSX.writeFile(wb, filename);

      return filename;
    },
    async approvalQuotation() {
      try {
        const filename = this.generateExcelTemplate();
        console.log('filename',filename);
       // this.UpdateMessage = await QuotationController.approvalQuotation(this.cqId, filename); // Pass the filename to the API
        console.log('Update Message', this.UpdateMessage);
        // setTimeout(() => {
        //   this.UpdateMessage = '';
        //   window.scrollTo(0, 0);
        //   window.location.reload();
        // }, 2000);
      } catch (error) {
        // this.FailMessage = "Error updating access permission: " + error.message;
        // setTimeout(() => {
        //   this.UpdateMessage = '';
        //   window.scrollTo(0, 0);
        //   window.location.reload();
        // }, 2000);
      }
    },
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

.cqapprovalBox-container {
  display: flex; 
}

.img {
  width: 100px  !important;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.cqbox {
  display: flex;
  border: 1px solid orange;
  padding: 15px;
  border-radius: 8px;
  background-color: #fef4e4;
  margin-bottom: 15px;
  width: 100%;
  box-shadow: 0 2px 4px #;
}

.left-container {
  flex: 0 0 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.md-card-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.right-container {
  flex: 1;
  padding-left: 20px;
}

.user-info {
  margin-bottom: 10px;
}

.user-name, .user-access {
  margin: 8px 0 10px;
}

.remarks-textarea {
  width: 100%;
  height: 80px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 14px;
}

.quotation-select {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #fff;
  appearance: none;
  cursor: pointer;
}

.quotation-select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}



</style>