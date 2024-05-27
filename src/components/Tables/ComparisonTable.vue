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
              {{ quotationData.Call_For_Quotation_Subcon_List.subcon_id }}
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
        <tfoot style="line-height: 8px !important;">
        </tfoot>
      </table>
      <br />
    </div>
    <div class="confirmation-message" v-if="QuotationName.length > 0">
      <p>Are you sure you want to submit the quotation?</p>
      <button class="btn-save" @click="submitQuotation">Submit</button>
    </div>
    <div class="box-container">
      <div class="box"></div>
    </div>
    <EditDescription :edit-modal="editModal" @editMessage="EditMessage" @editfail-message="EditErrorMessage" @close="closeEditModal" :id="editId" title="Edit Description"></EditDescription>
    <SubmitModal :submit-modal="submitModal"  @editMessage="EditMessage" @fail-message="EditErrorMessage" @close="closesubmitModal" title="Submit Approval" :ApprovalData="ApprovalDataArray"></SubmitModal>
  </div>
</template>

<script>
const XLSX = require('xlsx');
import { ref } from 'vue';
import DescriptionController from '@/services/controllers/DescriptionController.js';
import EditDescription from '@/components/Pop-Up-Modal/EditDescription.vue';
import SubmitModal from '@/components/Pop-Up-Modal/SubmitModal.vue';

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
    };
  },
  watch: {
    cqId(newValue, oldValue) {
      this.getDescription(newValue, this.isHide);
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
    }
  },
  methods: {
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
            this.QuotationName = getQuotation;

            let quotationTDs = '';
            let noquotationTDs = '';
            for (const quotationRate of getQuotation) {
              const SubconId = quotationRate.Call_For_Quotation_Subcon_List.subcon_id;
              const totalQuotation = await DescriptionController.getTotalQuotation(id, SubconId);
           
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
            
              noquotationTDs += `<td style="text-align:center;border-left:1px solid #ddd !important"></td>
                                <td style="text-align:center;border-right:1px solid #ddd !important"></td>`;
            }

            let unitQuantityTDs = '';
            let nounitQuantityTDs = '';
            cqUnitType.forEach((cqUnit) => {
              unitQuantityTDs += `<td style="text-align:center;">${cqUnit.quantity}</td>`;
              nounitQuantityTDs += `<td style="text-align:center;"></td>`;
            });


            const getHideHTML = isHide ? '' : `<td>${formData.bq_quantity}</td><td>${formData.adj_quantity}</td>`;
            const getNoHideHTML = isHide ? '' : `<td>$</td><td></td>`;
            const unitQuantityHTML = isHide ? '' : unitQuantityTDs;
            const nounitQuantityHTML = isHide ? '' : nounitQuantityTDs;


            if (formData.bq_quantity === 0) {
              head1Counter++;

              const head1Row = document.createElement('tr');
              head1Row.innerHTML = `
                <td><button class="edit-button" data-formid="${formData.id}">Edit</button></td>
                <td><b>${head1Counter}</b></td>
                <td><b>${formData.element || ''}</b></td>
                <td><b>${formData.sub_element || ''}</b></td>
                <td><b>${formData.description_sub_sub_element || ''}</b></td>
                <td><b>${formData.description_item}</b></td>
                <td></td>
                ${nounitQuantityHTML}
                ${getNoHideHTML}
                ${noquotationTDs}
              `;
              tableBody.appendChild(head1Row);

              head1Row.querySelector('.edit-button').addEventListener('click', (event) => {
                const formId = event.target.dataset.formid;
                this.editDescription(formId);
              });

              head2Counter = 0;
            }

            if (formData.bq_quantity !== 0) {
              head2Counter++;
      
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
            bqTotalAmountTDs += `<td colspan="2" >${subconAmount[0].bq_totalSaving}</td>`;
            adjTotalAmountTDs += `<td colspan="2" >${subconAmount[0].adj_totalSaving}</td>`;
            discountGivenTDs += `<td colspan="2" >${subconAmount[0].discount_given}</td>`;
            afterADJDiscountTDs += `<td colspan="2" >${subconAmount[0].afterADJDiscount_give}</td>`;
            overrumTDs += `<td colspan="2" >${subconAmount[0].adj_totalSaving}</td>`;
            winnerTDs += `<td colspan="2" ><b>${subconAmount[0].winner}sd</b></td>`;
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
      }, 2000);
    },
    EditErrorMessage(message) {
      this.FailMessage = message;
      setTimeout(() => {
        this.FailMessage = '';
        window.scrollTo(0, 0);
      }, 2000);
    },
    submitQuotation() {
      this.submitModal = true;
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




</style>