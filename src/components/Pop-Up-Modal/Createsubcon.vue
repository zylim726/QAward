<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content" style="width: 35%;max-height: 110vh !important;">
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
          v-model="phone_fex"
          placeholder="Phone Fex"
          class="typeInput"
          @focus="onInputFocus('phone_fex')"
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
          v-model="email_1"
          placeholder="First Email"
          class="typeInput"
          @focus="onInputFocus('email_1')"
        />
        <input
          type="text"
          v-model="email_2"
          placeholder="Second Email"
          class="typeInput"
          @focus="onInputFocus('email_2')"
        />
        <input
          type="text"
          v-model="email_3"
          placeholder="Third Email"
          class="typeInput"
          @focus="onInputFocus('email_3')"
        />
        <input
          type="text"
          v-model="short_code"
          placeholder="Short Code"
          class="typeInput"
          @focus="onInputFocus('short_code')"
        />
        <input
          type="text"
          v-model="area"
          placeholder="Area"
          class="typeInput"
          @focus="onInputFocus('area')"
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
      phone_fex: "",
      phone: "",
      contact_person: "",
      email_1: "",
      email_2: "",
      email_3: "",
      short_code: "",
      area: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
      this.name = "";
      this.reg_no ="";
      this.gst_id ="";
      this.address ="";
      this.phone_fex ="";
      this.phone ="";
      this.contact_person ="";
      this.email_1 ="";
      this.email_2 ="";
      this.email_3 ="";
      this.short_code ="";
      this.area ="";
    },
    
    saveAndCloseModal() {
      const subconData = {
        name: this.name,
        reg_no: this.reg_no,
        gst_id: this.gst_id,
        address: this.address,
        phone_fex: this.phone_fex,
        phone: this.phone,
        contact_person: this.contact_person,
        email_1: this.email_1,
        email_2: this.email_2,
        email_3: this.email_3,
        short_code: this.short_code,
        area: this.area
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
        const FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', FailMessage);
      }
    },
  },
};
</script>

