<template>
  <div class="modal" :class="{ 'is-active': editModal }">
    <div class="modal-background" @click="closeEditModal"></div>
    <div class="modal-content">
      <div class="box" style="width: 100% !important;">
        <h1 class="titleHeader">{{ title }}</h1>
        <br />
        <hr style="margin-top: -10px" />
        <br />
        <div class="form-container">
          <div class="left-box">
            <p style="text-align: left;">Trade Category : </p>
            <input
              type="text"
              v-model="cquotationData.trade_category"
              placeholder="Category"
              class="typeInput"
            />
            <p style="text-align: left;">Trade : </p>
            <input
              type="text"
              v-model="cquotationData.trade"
              placeholder="Trade"
              class="typeInput"
            />
            <p style="text-align: left;">Location 1 : </p>
            <input
              type="text"
              v-model="cquotationData.trade_location1"
              placeholder="Location 1"
              class="typeInput"
            />
            <p style="text-align: left;">Actual Calling Quotation Date : </p>
            <input
              type="date"
              v-model="cquotationData.actual_calling_quotation_date"
              placeholder="Actual Calling Quotation Date"
              class="typeInput"
            />
            <p style="text-align: left;">Awarding Target Date : </p>
            <input
              type="date"
              v-model="cquotationData.awading_target_date"
              placeholder="Awarding Target Date"
              class="typeInput"
            />
            <p style="text-align: left;">Remarks : </p>
            <input
              type="text"
              v-model="cquotationData.remarks"
              placeholder="Remarks"
              class="typeInput"
            />
          </div>
          <div class="right-box">
            <div v-for="(unit, index) in unitResult" :key="index">
              <p style="text-align: left;">Unit Type {{ index + 1 }} : </p>
              <input
                type="text"
                v-model="unit.type"
                placeholder="Unit Type"
                class="typeInput"
              />
              <p style="text-align: left;">Unit Quantity : </p>
              <input
                type="text"
                v-model="unit.quantity"
                placeholder="Unit Quantity"
                class="typeInput"
                readonly
                style="background-color: #fef4e4;"
              />
            </div>
          </div>
        </div>
        <div class="button-container">
          <button class="btn-save" aria-label="close" @click.stop="saveAndCloseModal">Save</button>
          <button class="btn-save" aria-label="close" @click.stop="closeEditModal">Close</button>
        </div>
      </div>
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
      processedData: [],
      unitResult:[],
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
  computed: {
    cquotationData() {
      return this.processedData.find((_, index) => index === 0) || {};
    }
  },
  methods: {
    closeEditModal() {
      this.$emit("close");
    },
    saveAndCloseModal() {
      this.processedData.forEach(item => {
        const updatedData = { ...item };
        this.unitResult.forEach(unit => {
          const updatedUnit = { ...unit };
          this.editCQ(item.id, updatedData, updatedUnit); 
        });
        this.editCQ(item.id, updatedData); 
      });
      
      this.closeEditModal();
    },
    async getDetailCQ(id) {
      try {
        const result = await CallofQuotationController.getDetailCQ(id);
        result.forEach(data => {
          this.processedData.push(data);
        });
        this.processElement();

        this.unitResult = await CallofQuotationController.getUnittype(id);
        console.log('unitResult',this.unitResult);

      } catch (error) {
        const FailMessage = "Error retrieving details: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    },
    processElement() {
      const Element = this.processedData.find((_, index) => index === 0);
      if (Element) {
        Object.keys(Element).forEach(key => {
        });
      }
    },
    async editCQ(id, updatedData, updatedUnit) {
      try {
        const UpdateMessage = await CallofQuotationController.editCQ(id, updatedData, updatedUnit);
        this.$emit('editMessage', UpdateMessage);
      } catch (error) {
        const FailMessage = "Error updating data: " + error.errorMessage;
        this.$emit('fail-message', FailMessage);
      }
    }
  }
};
</script>

