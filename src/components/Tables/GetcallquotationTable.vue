<template>
  <div>
    <loading-modal v-if="isLoading" />
    <div class="md-layout">
      <!-- Unit Types Table -->
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-25" style="padding: 0px 17px">
        <md-card>
          <div class="projectTable-container">
            <table class="project-table">
              <thead>
                <tr>
                  <th scope="col">
                    <label class="control control--checkbox">
                      <input type="checkbox" v-model="selectAllUnitTypes" @change="selectAllUnitTypesRows" />
                    </label>
                  </th>
                  <th scope="col">Unit Type</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">ADJ Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="UnitTypes.length === 0">
                  <td colspan="4" class="no-data" style="text-align: center;word-wrap: break-word;white-space: normal;">No Unit Types available. Please set up Unit Types in the Project Setup</td>
                </tr>
                <tr v-for="(formData, index) in UnitTypes" :key="'unit_' + index" :class="{ 'selected-row': formData.selected }">
                  <td><input type="checkbox" v-model="formData.selected"></td>
                  <td>{{ formData.unit_type }}</td>
                  <td>{{ formData.quantity }}</td>
                  <td>{{ formData.adj_factor }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </md-card>
      </div>

      <!-- Call Quotation Table -->
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-75" style="padding: 0px 17px">
        <md-card>
          <div class="projectTable-container">
            <table class="project-table">
              <thead>
                <tr>
                  <th scope="col">
                    <label class="control control--checkbox">
                      <input type="checkbox" v-model="selectAllCallQuotation" @change="selectAllCallQuotationRows" />
                    </label>
                  </th>
                  <th scope="col">Category</th>
                  <th scope="col">Trade</th>
                  <th scope="col">Location 1</th>
                  <th scope="col">Actual Calling Quotation Date (dd/mm/yyyy)</th>
                  <th scope="col">Awarding Target Date (dd/mm/yyyy)</th>
                  <th scope="col">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(formData, index) in callQuotation" :key="'cq_' + index" :class="{ 'selected-row': formData.selected }">
                  <td><input type="checkbox" v-model="formData.selected"></td>
                  <td>{{ formData.tradeCategory }}</td>
                  <td>{{ formData.trade }}</td>
                  <td>{{ formData.location }}</td>
                  <td>{{ displayDate(formData.CallingQuotationDate) }}</td>
                  <td>{{ displayDate(formData.awadingtargetdate) }}</td>
                  <td>{{ formData.remarks }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </md-card>
      </div>
      <div class="button-container">
        <button type="submit" class="btn-save" style="margin-top: -29px;margin-bottom: 10px;" @click="saveData">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";

export default {
  components:{LoadingModal},
  props: {
    Unittype: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      selectAllUnitTypes: true,
      selectAllCallQuotation: true,
      UnitTypes: [],
      callQuotation: [],
      loading:false,
    };
  },
  created() {
    this.getUTypes();
    this.getCQ();
  },
  watch: {
    UnitTypes: {
      handler: function(newValue) {
        this.$emit('selected-data', this.getSelectedUnitTypes());
      },
      deep: true,
    },
    callQuotation: {
      handler: function(newValue) {
        // Emit event whenever callQuotation change
        this.$emit('selected-call-quotation', this.getSelectedCallQuotation());
      },
      deep: true,
    },
  },
  methods: {
    selectAllUnitTypesRows() {
      this.UnitTypes.forEach(formData => formData.selected = this.selectAllUnitTypes);
    },
    selectAllCallQuotationRows() {
      this.callQuotation.forEach(formData => formData.selected = this.selectAllCallQuotation);
    },
    async getUTypes() {
      try {
        const processedData = await CallofQuotationController.getUTypes();
        if (processedData.length > 0) {
          this.UnitTypes = processedData.map(unitType => ({
            ...unitType,
            selected: true 
          }));
        } else {
          this.errorMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        }
      } catch (error) {
        this.handleFetchError(error);
      }
    },
    async getCQ() {
      try {
        const processedData = await CallofQuotationController.getCQ();
        if (processedData.length > 0) {
          this.callQuotation = processedData.map(cq => ({
            ...cq,
            selected: true 
          }));
        } else {
          this.errorMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        }
      } catch (error) {
        this.handleFetchError(error);
      }
    },
    async saveData() {
      try {
        this.loading = true;
        const selectedUnitTypes = this.UnitTypes.filter(formData => formData.selected);
        const selectedCallQuotation = this.callQuotation.filter(formData => formData.selected);
        const callIds = selectedCallQuotation.map(formData => formData.id);
        
        const updateMessage = await CallofQuotationController.addUnit(callIds, selectedUnitTypes);
        this.$emit('message', updateMessage);

        selectedCallQuotation.forEach(formData => {
          const index = this.callQuotation.indexOf(formData);
          if (index !== -1) {
            this.callQuotation.splice(index, 1);
          }
        });

        this.$router.push({ path: 'callquotation' });

      } catch (error) {
        this.loading = false;
        const failMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
        this.$emit('fail-message', failMessage);
      } finally {
        this.loading = false;
      }
    },
    handleFetchError(error) {
      this.errorMessage =  `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
    },
    displayDate(dateStr) {
      if (dateStr === "0000-00-00") {
        return "";
      }
      
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const date = new Date(dateStr);
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
      }
      
      return dateStr;
    },
    getSelectedUnitTypes() {
      return this.UnitTypes.filter(formData => formData.selected);
    },
    getSelectedCallQuotation() {
      return this.callQuotation.filter(formData => formData.selected);
    },
  },
};
</script>

