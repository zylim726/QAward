<template>
  <div>
    <div class="modal-overlay" v-if="isVisible" @click="closeModal">
      <div class="modal">
        <md-icon class="close" @click="closeModal">close</md-icon>
        <div class="content">
          <img class="check" src="../../assets/img/check.png" alt="Checkmark" />
          <h4>Confirm Submit the Approval Quotation.</h4>
          <div class="submit-footer">
            <button @click="submitForm" class="btnApproval">Approval</button>
          </div>
        </div>
      </div>
    </div>
    <button
      @click="openModal"
      class="btn-finalysave"
      style="margin-right: -20px"
    >
      Submit
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false, // Set to false initially
    };
  },
  methods: {
    openModal() {
      this.isVisible = true; // Set isVisible to true to show the modal
    },
    closeModal() {
      this.isVisible = false; // Set isVisible to false to hide the modal
    },
    submitForm() {
      // Handle form submission
      this.$emit("submit-form");
      this.isVisible = false; // Optionally, hide the modal after submitting the form
    },
  },
};
</script>

<style scoped>
/* Your modal styles here */
</style>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center; /* Vertically center content */
}

.modal {
  text-align: center;
  background-color: white;
  width: 300px; /* Adjust as needed */
  max-height: 40%; /* Adjust as needed */
  overflow-y: auto; /* Add scrollbar if content exceeds max-height */
  padding: 24px;
  border-radius: 20px;
  position: relative;
  margin-top: -180px;
  background-color: #fffaf0;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.content {
  margin-bottom: 20px;
}

.check {
  width: 130px;
  margin-bottom: 20px;
}

.submit-footer {
  display: flex;
  justify-content: center; /* Center button horizontally */
}

.btnApproval {
  background-color: #0ab39c;
  width: 135px;
  height: 35px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}
</style>
