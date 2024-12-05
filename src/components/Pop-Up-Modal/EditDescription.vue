<template>
  <div class="modal" :class="{ 'is-active': editModal }">
    <div class="modal-background" @click="closeEditModal"></div>
    <div class="modal-content" style="width: 30%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <p>Element : </p>
        <input
            type="text"
            v-model="processedData.element"
            placeholder="Element"
            class="typeInput"
        />
        <p>Sub Element : </p>
        <input
          type="text"
          v-model="processedData.sub_element"
          placeholder="Sub Element"
          class="typeInput"
        />
        <p>Sub Sub Element : </p>
        <input
          type="text"
          v-model="processedData.description_sub_sub_element"
          placeholder="Sub Sub Element"
          class="typeInput"
        />

        <p>Description Item : </p>
        <input
          type="text"
          v-model="processedData.description_item"
          placeholder="Description Item"
          class="typeInput"
        />
        <p>Unit : </p>
        <input
          type="text"
          v-model="processedData.description_unit"
          placeholder="Unit"
          class="typeInput"
        />
      </div>
      <button class="btn-save" aria-label="close" @click.stop="closeEditModal">Close</button>
      <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal()">Save</button>
    </div>
  </div>
</template>

<script>
import DescriptionController from "@/services/controllers/DescriptionController.js";

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
        this.getDescriptionDetail(newVal);
      }
    }
  },
  methods: {
    closeEditModal() {
      this.$emit("close");
    },
    saveAndCloseModal() {
      const id = this.processedData.id; 
      const updatedData = { ...this.processedData };
      this.editDescription(id, updatedData); 
      this.closeEditModal();
    },
    async getDescriptionDetail(id) {
      try {
        const descriptionData = await DescriptionController.getDescriptionDetail(id);
        descriptionData.forEach(formData => {
          this.processedData = formData;
        })
      } catch (error) {
        const FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', FailMessage);
      }
    },
    async editDescription(id, updatedData) {
      try {
        this.UpdateMessage = await DescriptionController.editDescription(id, updatedData);
        this.$emit('editMessage', this.UpdateMessage);
        setTimeout(() => {
          window.location.reload();
        }, 1000); 
      } catch (error) {
        const FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', FailMessage);
      }
    }
  },
};
</script>

<style>
p{
  text-align: left;
}</style>