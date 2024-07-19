<template>
  <div class="modal" :class="{ 'is-active': delModal }">
    <div class="modal-background" @click="deleteModal"></div>
    <div class="modal-content" style="width: 25%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <md-icon style="text-align: center;font-size: 79px !important;color: red;margin-top: 19px;">highlight_off</md-icon>
        <p class="Inforrsubtitle" style="margin-top: 50px;">Please confirm deletion of the data !</p>
      <button
      class="btn-save"
      aria-label="close"
      @click.stop="deleteModal"
    >
      Close
    </button>
    <button
      class="btn-save"
      aria-label="close"
      @click.stop="saveAnddeleteModal(id)"
    >
      OK
    </button>
    </div>
    </div>
  </div>
</template>

<script>
import QuotationController from "@/services/controllers/QuotationController.js";

export default {
  props: {
    delModal: Boolean,
    title: String,
    id: Array 
  },
  data() {
    return {
    };
  },
  methods: {
    deleteModal() {
      this.$emit("closeDelete");
    },
    saveAnddeleteModal(id) {
      this.removeSubcon(id);
      this.deleteModal();
    },
    async removeSubcon(id) {
      try {
        const deleteId = Number(id[0]);
       const SuccessMessage = await QuotationController.removeSubcon(deleteId);
        this.$emit('editSubconMessage', SuccessMessage); 
      } catch (error) {
        const FailMessage =  `Error Message: ${error.message || 'Unknown Data.'}`;
        this.$emit('editfail-message', FailMessage);
      }
    }
  },
};
</script>

