<template>
  <div class="modal" :class="{ 'is-active': rejectModal }">
    <div class="modal-background" @click="closerejectModal"></div>
    <div class="modal-content" style="width: 30%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <p style="text-align: left; margin-top: 10px;">Remarks:</p>
        <input
          type="text"
          placeholder="Remarks"
          class="typeInput"
          v-model="remarksData"
        />
      </div>
      <button class="btn-save" aria-label="close" @click.stop="closerejectModal">Close</button>
      <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal(remarksData, selectedQuotation)">Save</button>
    </div>
  </div>
</template>

<script>
import QuotationController from "@/services/controllers/QuotationController.js";

export default {
  props: {
    rejectModal: {
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
      default: null
    }
  },
  data() {
    return {
      remarksData: "",
    };
  },
  methods: {
    closerejectModal() {
      this.$emit("close");
      this.scrollToTop();
    },
    async saveAndCloseModal(remarksData) {
      try {
        const CQid = this.ApprovalData[0].call_for_quotation_id;
        const getFile = this.excelFile;
        const SuccessMessage = await QuotationController.CMrejectedQuotation(remarksData,CQid,getFile); 
        this.$emit('editMessage', SuccessMessage); 
        this.closerejectModal(); 
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
