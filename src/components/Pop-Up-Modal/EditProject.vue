<template>
  <div class="modal" :class="{ 'is-active': editProject }">
    <div class="modal-background" @click="closeeditProj"></div>
    <div class="modal-content" style="width: 35%;max-height: 100vh !important;">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <div v-if="processedData">
          <div class="form-row">
            <div class="form-group">
              <p>Code :</p>
              <input
                type="text"
                v-model="processedData.code"
                placeholder="Code"
                class="typeInput"
              />
            </div>
            <div class="form-group">
              <p>Name : </p>
              <input
                type="text"
                v-model="processedData.name"
                placeholder="Name"
                class="typeInput"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <p>Area : </p>
              <input
                type="text"
                v-model="processedData.area"
                placeholder="Area"
                class="typeInput"
              />
            </div>
            <div class="form-group">
              <p>Reg No :</p>
              <input
                type="text"
                v-model="processedData.regno"
                class="typeInput"
              />
            </div>
          </div>
          <button class="btn-save" aria-label="close" @click.stop="closeeditProj">Close</button>
          <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectController from "@/services/controllers/ProjectController.js";

export default {
  props: {
    editProject: Boolean,
    title: String,
    id: Number,
  },
  data() {
    return {
      processedData: null,
    };
  },
  watch: {
    id(newVal) {
      if (newVal !== null) {
        this.getDetailProject(newVal);
      }
    }
  },
  methods: {
    closeeditProj() {
      this.$emit("close");
    },
    saveAndCloseModal() {
      const updatedData = { ...this.processedData };
      this.editProjs(updatedData.id, updatedData); 
      this.closeeditProj();
    },
    async getDetailProject(id) {
      try {
        this.processedData = await ProjectController.getDetailProject(id);
      } catch (error) {
        const FailMessage = "Error fetching project details: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    async editProjs(id, updatedData) {
      try {
        const updateMessage = await ProjectController.editProjs(id, updatedData);
        this.$emit('editMessage', updateMessage);
        setTimeout(() => {
          window.location.reload();
        }, 1000); 
      } catch (error) {
        const FailMessage = "Error updating project: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    }
  },
};
</script>

<style scoped>
.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.form-group {
  flex: 1;
  margin-right: 10px;
}

.form-group p {
  margin: 0;
  margin-bottom: 5px;
}
</style>
