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
          v-model="processedData[0].tradeCategory"
          placeholder="Category"
          class="typeInput"
          @focus="onInputFocus('Category')"
        />
        <input
          type="text"
          v-model="processedData[0].trade"
          placeholder="Trade"
          class="typeInput"
          @focus="onInputFocus('Trade')"
        />
        <input
          type="text"
          v-model="processedData[0].location"
          placeholder="Location 1"
          class="typeInput"
          @focus="onInputFocus('Location')"
        />
        <input
          type="text"
          v-model="processedData[0].budgetAmount"
          placeholder="AA Budget Amount"
          class="typeInput"
          @focus="onInputFocus('BudgetAmount')"
        />
        <input
          type="date"
          v-model="processedData[0].CallingQuotationDate"
          placeholder="Actuall Calling Quotation Date"
          class="typeInput"
          @focus="onInputFocus('ActuallCallingDate')"
        />
        <input
          type="date"
          v-model="processedData[0].awadingtargetdate"
          placeholder="Awading Target Date"
          class="typeInput"
          @focus="onInputFocus('awadingTarget')"
        />
        <input
          type="text"
          v-model="processedData[0].remarks"
          placeholder="Remarks"
          class="typeInput"
          @focus="onInputFocus('Remarks')"
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
      processedData: [
        {
          tradeCategory: "",
          trade: "",
          location:"",
          budgetAmount:"",
          actuallCallingDate:"",
          awadingTargetDate:"",
          remarks:""
        }
      ]
    };
  },
  mounted() {
    this.$emit('open');
  },
  watch: {
    id(newVal) {
      if (newVal !== null) {
        this.getCQ(newVal);
      }
    }
  },
  methods: {
    closeEditModal() {
      this.$emit("close");
    },
    saveAndCloseModal() {
      const id = this.processedData[0].id; // Get the id from processedData
      const updatedData = { ...this.processedData[0] }; // Clone the processedData object
      this.editCQ(id, updatedData); // Pass id and updatedData to editCQ method
      this.closeEditModal();
    },
    async getCQ(id) {
      try {
        this.processedData = await CallofQuotationController.getCQ(id);
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
        }, 2500); 
      } catch (error) {
        const FailMessage = "Error updating access permission: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    }
  },
};
</script>
