<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content" style="width: 25%">
      <div class="box">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <input
          type="text"
          v-model="name"
          placeholder="Name"
          class="typeInput"
          @focus="onInputFocus('name')"
        />
        <input
          type="text"
          v-model="reg_no"
          placeholder="Reg No"
          class="typeInput"
          @focus="onInputFocus('reg_no')"
        />
        <input
          type="text"
          v-model="gst_id"
          placeholder="GST Id"
          class="typeInput"
          @focus="onInputFocus('gst_id')"
        />
        <input
          type="text"
          v-model="address"
          placeholder="Address"
          class="typeInput"
          @focus="onInputFocus('address')"
        />
        <input
          type="text"
          v-model="acc_code"
          placeholder="Acc Code"
          class="typeInput"
          @focus="onInputFocus('acc_code')"
        />
        <input
          type="text"
          v-model="phone"
          placeholder="Phone"
          class="typeInput"
          @focus="onInputFocus('phone')"
        />
        <input
          type="text"
          v-model="contact_person"
          placeholder="Contact Person"
          class="typeInput"
          @focus="onInputFocus('contact_person')"
        />
        <input
          type="text"
          v-model="email"
          placeholder="Email"
          class="typeInput"
          @focus="onInputFocus('email')"
        />
        <input
          type="text"
          v-model="short_code"
          placeholder="Short Code"
          class="typeInput"
          @focus="onInputFocus('short_code')"
        />
      </div>
      <button
      class="btn-save"
      aria-label="close"
      @click.stop="closeModal"
    >
      Close
    </button>
    <button
      class="btn-save"
      aria-label="close"
      @click.stop="saveAndCloseModal"
    >
      Save
    </button>
    </div>
  </div>
</template>

<script>
import SubconController from "@/services/controllers/SubconController.js";
export default {
  props: {
    showModal: Boolean,
    title: String,
  },
  data() {
    return {
      name: "",
      reg_no: "",
      gst_id: "",
      address: "",
      acc_code: "",
      phone: "",
      contact_person: "",
      email: "",
      short_code: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.name = "";
      this.reg_no ="";
      this.gst_id ="";
      this.address ="";
      this.acc_code ="";
      this.phone ="";
      this.contact_person ="";
      this.email ="";
      this.short_code ="";
    },
    saveAndCloseModal() {
      const subconData = {
        name: this.name,
        reg_no: this.reg_no,
        gst_id: this.gst_id,
        address: this.address,
        acc_code: this.acc_code,
        phone: this.phone,
        contact_person: this.contact_person,
        email: this.email,
        short_code: this.short_code
      };
      this.addSubconToServer(subconData);
      this.closeModal();
    },

    onInputFocus(input) {},
    async addSubconToServer(subconData) {
      try {
        const UpdateMessage = await SubconController.addSubcon(subconData);
        this.$emit('message', UpdateMessage);
        setTimeout(function() {
          window.location.reload();
        }, 500); 
      } catch (error) {
        const FailMessage = "Error updating subcon: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
  },
};
</script>

