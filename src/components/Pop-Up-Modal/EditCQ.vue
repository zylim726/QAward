<template>
  <div class="modal" :class="{ 'is-active': editModal }">
    <div class="modal-background" @click="closeEditModal"></div>
    <div class="modal-content" style="max-height: 550px;">
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
              readonly
              style="background-color: #fef4e4;"
            />
            <p style="text-align: left;">Trade : </p>
            <input
              type="text"
              v-model="cquotationData.trade"
              placeholder="Trade"
              class="typeInput"
              readonly
              style="background-color: #fef4e4;"
            />
            <p style="text-align: left;">Location 1 : </p>
            <input
              type="text"
              v-model="cquotationData.trade_location1"
              placeholder="Location 1"
              class="typeInput"
              readonly
              style="background-color: #fef4e4;"
            />
            <p style="text-align: left;">Actual Calling Quotation Date : </p>
            <input
              type="text"
              :value="formatDate(cquotationData.actual_calling_quotation_date)"
              placeholder="Actual Calling Quotation Date"
              class="typeInput"
              readonly
              style="background-color: #fef4e4;"
            />
            <p style="text-align: left;">Awarding Target Date : </p>
            <input
              type="text"
              :value="formatDate(cquotationData.awarding_target_date)"
              placeholder="Awarding Target Date"
              class="typeInput"
              readonly
              style="background-color: #fef4e4;"
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
                readonly
                style="background-color: #fef4e4;"
              />
              <p style="text-align: left;">ADJ Factor : </p>
              <input
                type="text"
                v-model="unit.adj_factor"
                placeholder="Unit Quantity"
                class="typeInput"
                readonly
                style="background-color: #fef4e4;"
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

        const getCQUnitData = await CallofQuotationController.getUnittype(id);
        this.unitResult = getCQUnitData.cqUnitTypes;
        console.log('this.unitResult',this.unitResult);

      } catch (error) {
        const FailMessage =  `Error Message: ${error.message || 'Unknown Data.'}`;
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
        const FailMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', FailMessage);
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
    },
  },
};
</script>

<style scoped>
.message {
  color: red;
  text-align: center;
}
</style>
