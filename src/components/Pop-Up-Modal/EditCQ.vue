<template>
  <div class="modal" :class="{ 'is-active': editModal }">
    <div class="modal-background" @click="closeEditModal"></div>
    <div class="modal-content" style="width: 30%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <input
          type="text"
          v-model="processedData[0].trade_category"
          placeholder="Category"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].trade"
          placeholder="Trade"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].trade_location1"
          placeholder="Location 1"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].aa_budget_amount"
          placeholder="AA Budget Amount"
          class="typeInput"
        />
        <input
          type="date"
          v-model="processedData[0].actual_calling_quotation_date"
          placeholder="Actuall Calling Quotation Date"
          class="typeInput"
        />
        <input
          type="date"
          v-model="processedData[0].awading_target_date"
          placeholder="Awading Target Date"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].remarks"
          placeholder="Remarks"
          class="typeInput"
        />
      </div>
      <button class="btn-save" aria-label="close" @click.stop="closeEditModal">Close</button>
      <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal()">Save</button>
    </div>
  </div>
</template>

<script>
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";

export default {
  props: {
    editModal: Boolean,
    title: String,
    id: Number,
  },
  data() {
    return {
      processedData: "",
    };
  },
  mounted() {
    this.$emit('open');
  },
  watch: {
    id(newVal) {
      if (newVal !== null) {
        this.getDetailCQ(newVal);
      }
    }
  },
  methods: {
    closeEditModal() {
      this.$emit("close");
    },
    saveAndCloseModal() {
      const id = this.processedData[0].id; 
      const updatedData = { ...this.processedData[0] };
      this.editCQ(id, updatedData); 
      this.closeEditModal();
    },
    async getDetailCQ(id) {
      try {
        this.processedData = await CallofQuotationController.getDetailCQ(id);

      } catch (error) {
        const FailMessage = "Error updating access permission: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    async editCQ(id, updatedData) {
      try {
        this.UpdateMessage = await CallofQuotationController.editCQ(id, updatedData);
        this.$emit('editMessage', this.UpdateMessage);
        setTimeout(() => {
          window.location.reload();
        }, 1000); 
      } catch (error) {
        const FailMessage = "Error updating access permission: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    }
  },
};
</script>
