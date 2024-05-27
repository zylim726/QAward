<template>
  <div class="modal" :class="{ 'is-active': submitModal }">
    <div class="modal-background" @click="closesubmitModal"></div>
    <div class="modal-content" style="width: 30%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <p>Remarks:</p>
        <input
          type="text"
          placeholder="Remarks"
          class="typeInput"
          v-model="remarksData"
        />
      </div>
      <button class="btn-save" aria-label="close" @click.stop="closesubmitModal">Close</button>
      <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal(remarksData, ApprovalData)">Save</button>
    </div>
  </div>
</template>

<script>
import QuotationController from "@/services/controllers/QuotationController.js";

export default {
  props: {
    submitModal: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    ApprovalData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      remarksData: ""
    };
  },
  methods: {
    closesubmitModal() {
      this.$emit("close");
      this.scrollToTop(); 
    },
    async saveAndCloseModal(remarksData, approvalData) {
      try {
        const SuccessMessage = await QuotationController.addApproval(remarksData, approvalData);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.$emit('editMessage', Message); // Emit the message
        this.closesubmitModal(); // Close the modal
      } catch (error) {
        const FailMessage = "Error updating access permission: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
        this.scrollToTop(); // Call the method to scroll to the top
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0); // Scroll to the top of the window
    }
  }
};
</script>
