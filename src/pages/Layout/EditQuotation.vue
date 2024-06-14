<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px">
        <md-card>
          <md-card-content>
            <div class="table-container" style="margin-top: 10px !important;">
              <table class="nested-table" id="data-table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Element</th>
                    <th scope="col">Sub Element</th>
                    <th scope="col">Sub Sub Element</th>
                    <th scope="col">Description</th>
                    <th scope="col">Unit</th>
                    <th v-for="(unitdata, unitIndex) in Unittype" :key="'unit-'+unitIndex" style="text-align: center;">
                      {{ unitdata.cqUnitType.type }}
                    </th>
                    <th scope="col">BQ QTY</th>
                    <th scope="col">(ADJ) QTY</th>
                    <th scope="col" v-for="(quotationData, qIndex) in QuotationName" :key="'quotation-'+qIndex" style="text-align: center;">
                      {{ quotationData.Call_For_Quotation_Subcon_List.Subcon.name }}
                    </th>
                  </tr>
                  <tr>
                    <th></th>
                    <th colspan="5"></th>
                    <th scope="col" v-for="(unitdata, unitIndex) in Unittype" :key="'unit-quantity-'+unitIndex" style="text-align: center;">
                      {{ unitdata.cqUnitType.quantity }}
                    </th>
                    <th colspan="2"></th>
                    <th scope="col" style="text-align: center;">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(formData, formIndex) in Description" :key="'form-'+formIndex">
                    <template v-if="formData.quotation.length <= 0 || formData.quotation[0].total_quote_amount === 0">
                      <td><b>{{ formIndex + 1 }}</b></td>
                      <td><b>{{ formData.element || '' }}</b></td>
                      <td><b>{{ formData.sub_element || '' }}</b></td>
                      <td><b>{{ formData.description_sub_sub_element || '' }}</b></td>
                      <td><b>{{ formData.description_item }}</b></td>
                      <td><b>{{ formData.description_unit || '' }}</b></td>
                      <td colspan="8"></td>
                    </template>
                    <template v-else>
                      <td>{{ formIndex + 1 }}</td>
                      <td>{{ formData.element || '' }}</td>
                      <td>{{ formData.sub_element || '' }}</td>
                      <td>{{ formData.description_sub_sub_element || '' }}</td>
                      <td style="padding-left: 60px !important;">{{ formData.description_item }}</td>
                      <td>{{ formData.description_unit || '' }}</td>
                      <td v-for="(cqUnit, unitIndex) in formData.cqUnitType" :key="'cqUnit-'+formIndex+'-'+unitIndex" style="text-align: center;">
                        {{ cqUnit.quantity }}
                      </td>
                      <td>{{ formData.bq_quantity }}</td>
                      <td>{{ formData.adj_quantity }}</td>
                      <td v-for="(quotationData, qIndex) in QuotationName" :key="'rate-'+formIndex+'-'+qIndex" style="text-align: center;">
                        <input type="number" v-model="RateInput[formData.id]"   />
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <div style="display: flex; align-items: center;">
                <label for="discount" style="margin-right: 5px;">Discount:</label>
                <input type="number" id="discount" v-model.number="discount" style="width: 94%;" />
              </div>
            </div>
            <br>
            <button type="submit" class="btn-save" @click="saveAllData">Submit</button>
            <br>
          </md-card-content>
          <br>
        </md-card>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import DescriptionController from "@/services/controllers/DescriptionController.js";

export default {
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
      Unittype: [],
      QuotationName: [],
      Description: [],
      discount: 0,
      RateInput: {}, 
    };
  },
  mounted() {
    const id = this.$route.query.cqId;
    const subconId = this.$route.query.sbConId;
    this.getNewDescription(id, subconId);
  },
  methods: {
    async getNewDescription(id, subconId) {
      try {
        const processedData = await DescriptionController.getNewDescription(id);
        this.Description = processedData;
        processedData.forEach((formData) => {
          const cqUnitType = formData.cqUnitType;
          const getQuotation = formData.quotation;
          this.Unittype = cqUnitType;

          const filteredQuotations = getQuotation.filter(quotationRate =>
            String(quotationRate.Call_For_Quotation_Subcon_List.subcon_id) === String(subconId)
          );


          if (filteredQuotations.length > 0) {
            this.QuotationName = filteredQuotations;

            filteredQuotations.forEach(quotation => {
              this.$set(this.RateInput, formData.id, quotation.quote_rate || '');
            });
          }

          console.log('this RateInput',this.RateInput);
        });

      } catch (error) {
        console.error('Error fetching Description:', error);
        throw error;
      }
    },
    async saveAllData() {
      try {
        const subconId = this.$route.query.sbConId;
        const dataToSave = this.Description.map(formData => {
        const filteredQuotation = formData.quotation.find(quotation => {
          return String(quotation.Call_For_Quotation_Subcon_List.subcon_id) === String(subconId);
        });

        if (!filteredQuotation) {
          return null;
        }
        const quotationId = filteredQuotation.id;
        const rate = this.RateInput[formData.id];
        const subconListId = filteredQuotation.call_for_quotation_subcon_list_id;

        return { subconListId, rate, quotationId };
      }).filter(data => data !== null);
      
        const discount = this.discount;
        const SuccessMessage = await DescriptionController.editQuotation(dataToSave,discount);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.UpdateMessage = Message;
        this.$router.push({ name: 'Subcon Comparison', query: { cqID: this.$route.query.cqId } }); // use actual route name and pass the query parameter

      } catch (error) {
        this.FailMessage = "Failed to save data.";
      }
    },
  },
};
</script>

