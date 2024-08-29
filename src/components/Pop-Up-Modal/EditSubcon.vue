<template>
  <div class="modal" :class="{ 'is-active': editSubcon }">
    <div class="modal-background" @click="closeeditSub"></div>
    <div class="modal-content" style="width: 40%;max-height: 550px !important;">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <div class="form-row">
          <div class="form-group">
            <p>Name : </p>
            <input
              type="text"
              v-model="processedData[0].name"
              placeholder="Name"
              class="typeInput"
            />
          </div>
          <div class="form-group">
            <p>Reg No :</p>
            <input
              type="text"
              v-model="processedData[0].reg_no"
              placeholder="Reg No"
              class="typeInput"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <p>Gst Id :</p>
            <input
              type="text"
              v-model="processedData[0].gst_id"
              placeholder="GST Id"
              class="typeInput"
            />
          </div>
          <div class="form-group">
            <p>Address : </p>
            <input
              type="text"
              v-model="processedData[0].address"
              placeholder="Address"
              class="typeInput"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <p>Phone Fex : </p>
            <input
              type="text"
              v-model="processedData[0].phone_fex"
              placeholder="Phone Fex"
              class="typeInput"
            />
          </div>
          <div class="form-group">
            <p>Phone : </p>
            <input
              type="int"
              v-model="processedData[0].phone"
              placeholder="Phone"
              class="typeInput"
            />
          </div>
          
        </div>
        <div class="form-row">
          <div class="form-group">
            <p>Contact Person : </p>
            <input
              type="text"
              v-model="processedData[0].contact_person"
              placeholder="Contact Person"
              class="typeInput"
            />
          </div>
          <div class="form-group">
            <p>Short Code</p>
            <input
              type="text"
              v-model="processedData[0].short_code"
              placeholder="Short Code"
              class="typeInput"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <p>First Email : </p>
            <input
              type="text"
              v-model="processedData[0].email_1"
              placeholder="First Email"
              class="typeInput"
            />
          </div>
          <div class="form-group">
            <p>Second Email : </p>
            <input
              type="text"
              v-model="processedData[0].email_2"
              placeholder="Second Email"
              class="typeInput"
            />
          </div>
          <div class="form-group">
            <p>Third Email : </p>
            <input
              type="text"
              v-model="processedData[0].email_3"
              placeholder="Third Email"
              class="typeInput"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <p>Area : </p>
            <input
              type="text"
              v-model="processedData[0].area"
              placeholder="Area"
              class="typeInput"
            />
          </div>
          
        </div>
        <!-- Add more rows as needed -->
        <button class="btn-save" aria-label="close" @click.stop="closeeditSub">Close</button>
        <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal()">Save</button>
      </div>
      <br><br>
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
        const FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
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
        const FailMessage =  `Error Message: ${error.message || 'Unknown Data.'}`;
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
  text-align: left;
  margin-bottom: 5px;
}
</style>
