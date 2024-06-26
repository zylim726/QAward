<template>
  <div class="modal" :class="{ 'is-active': submitModal }">
    <div class="modal-background" @click="closesubmitModal"></div>
    <div class="modal-content" style="width: 30%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <p style="margin: 8px 0 10px; text-align: left;">Recommend Award To:</p>
        <select class="quotation-select" v-model="selectedQuotation">
          <option v-for="(quotationData, qIndex) in matchingData" :key="qIndex" :value="quotationData.id">
            {{ quotationData.Subcon.name }}
          </option>
        </select>
        <br>
        <p style="text-align: left; margin-top: 10px;">Remarks:</p>
        <input
          type="text"
          placeholder="Remarks"
          class="typeInput"
          v-model="remarksData"
        />
      </div>
      <button class="btn-save" aria-label="close" @click.stop="closesubmitModal">Close</button>
      <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal(remarksData, selectedQuotation)">Save</button>
    </div>
  </div>
</template>

<script>
import QuotationController from "@/services/controllers/QuotationController.js";

export default {
  props: {
    submitModal: {
      type: Boolean,
      required: true, 
    },
    title: {
      type: String,
      required: true
    },
    ApprovalData: {
      type: Array,
      required: true
    },
    excelFile: {
      type: File,
      required: true
    }
  },
  data() {
    return {
      remarksData: "",
      matchingData: [],
      selectedQuotation: null
    };
  },
  watch: {
    submitModal(newVal) {
      if (newVal) {
        this.fetchAndDisplayData();
      } else {
        this.matchingData = []; 
      }
    }
  },
  methods: {
    closesubmitModal() {
      this.$emit("close");
      this.scrollToTop();
    },
    async fetchAndDisplayData() {
      try {
        const processedData = await QuotationController.getCMSubmit();
        const id = this.ApprovalData;
       
        this.matchingData = processedData.filter(item => {
          return item.call_for_quotation_id === Number(id) && item.subcon_id !== 1;
        });

        if (this.matchingData.length === 0) {
          const FailMessage = "No data found for call_for_quotation_id";
          this.$emit('fail-message', FailMessage);
        } else {
          this.selectedQuotation = this.matchingData[0].id;
        }
      } catch (error) {
        const FailMessage = "Error: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    async saveAndCloseModal(remarksData, selectedQuotation) {
      try {
        const CQid = this.ApprovalData;
        const getFile = this.excelFile;
        const SuccessMessage = await QuotationController.addApproval(remarksData, selectedQuotation, CQid);
        this.$emit('editMessage', SuccessMessage); 
        this.closesubmitModal(); 
      } catch (error) {
        const FailMessage = "Error: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
        this.scrollToTop(); 

      }
    },
    scrollToTop() {
      window.scrollTo(0, 0); 
    }
  },
};
</script>
