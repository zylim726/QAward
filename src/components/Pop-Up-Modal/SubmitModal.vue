<template>
  <div class="modal" :class="{ 'is-active': submitModal }">
    <div class="modal-background" @click="closesubmitModal"></div>
    <div class="modal-content" style="width: 30%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <p>Remarks : </p>
        <!-- Bind input value to remarksData -->
        <input
            type="text"
            placeholder="Remarks"
            class="typeInput"
            v-model="remarksData"
        />
      </div>
      <button class="btn-save" aria-label="close" @click.stop="closesubmitModal">Close</button>
      <!-- Pass remarksData and ApprovalData to saveAndCloseModal -->
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
  mounted() {
    this.$emit('open');
  },
  methods: {
    closesubmitModal() {
      this.$emit("close");
    },
    saveAndCloseModal(remarksData, approvalData) {
      this.addCQApproval(remarksData, approvalData);
      //this.closeEditModal();
    },
    async addCQApproval(remarksData, approvalData) {
      try {
        this.UpdateMessage = await QuotationController.addCQApproval(remarksData, approvalData);
        console.log('message',this.UpdateMessage);
        //this.$emit('editMessage', this.UpdateMessage);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000); 
      } catch (error) {
        const FailMessage = "Error updating access permission: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    }
  },
  watch: {
    // Watch for changes in ApprovalData
    ApprovalData: {
      handler(newValue, oldValue) {
      },
      immediate: true // Log the initial value immediately
    }
  }
};
</script>
