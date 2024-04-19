<template>
  <div class="modal" :class="{ 'is-active': editSubcon }">
    <div class="modal-background" @click="closeeditSub"></div>
    <div class="modal-content" style="width: 30%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <input
          type="text"
          v-model="processedData[0].name"
          placeholder="Name"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].reg_no"
          placeholder="Reg No"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].gst_id"
          placeholder="GST Id"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].address"
          placeholder="Address"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].acc_code"
          placeholder="Acc Code"
          class="typeInput"
        />
        <input
          type="int"
          v-model="processedData[0].phone"
          placeholder="Phone"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].contact_person"
          placeholder="Contact Person"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].email"
          placeholder="Email"
          class="typeInput"
        />
        <input
          type="text"
          v-model="processedData[0].short_code"
          placeholder="Short Code"
          class="typeInput"
        />
      </div>
      <button class="btn-save" aria-label="close" @click.stop="closeeditSub">Close</button>
      <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal()">Save</button>
    </div>
  </div>
</template>

<script>
import SubconController from "@/services/controllers/SubconController.js";

export default {
  props: {
    editSubcon: Boolean,
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
        this.getDetailSubcon(newVal);
      }
    }
  },
  methods: {
    closeeditSub() {
      this.$emit("close");
    },
    saveAndCloseModal() {
      const id = this.processedData[0].id; 
      const updatedData = { ...this.processedData[0] };
      this.editSubc(id, updatedData); 
      this.closeeditSub();
    },
    async getDetailSubcon(id) {
      try {
        this.processedData = await SubconController.getDetailSubcon(id);
      } catch (error) {
        const FailMessage = "Error updating access permission: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    async editSubc(id, updatedData) {
      try {
        this.UpdateMessage = await SubconController.editSubc(id, updatedData);
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
