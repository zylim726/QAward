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
                    <template v-if="formData.quotation.length <= 0 || (parseFloat(formData.adj_quantity) === 0.00 && formData.description_unit.trim() === '')  ">
                      <td><b>{{ formIndex + 1 }}</b></td>
                      <td><b>{{ formData.element || '' }}</b></td>
                      <td><b>{{ formData.sub_element || '' }}</b></td>
                      <td><b>{{ formData.description_sub_sub_element || '' }}</b></td>
                      <td class="td-max-width"><b>{{ formData.description_item }}</b></td>
                      <td><b>{{ formData.description_unit || '' }}</b></td>
                      <td colspan="8"></td>
                    </template>
                    <template v-else>
                      <td>{{ formIndex + 1 }}</td>
                      <td>{{ formData.element || '' }}</td>
                      <td>{{ formData.sub_element || '' }}</td>
                      <td>{{ formData.description_sub_sub_element || '' }}</td>
                      <td style="padding-left: 60px !important;" class="td-max-width">{{ formData.description_item }}</td>
                      <td>{{ formData.description_unit || '' }}</td>
                      <td v-for="(cqUnit, unitIndex) in formData.cqUnitType" :key="'cqUnit-'+formIndex+'-'+unitIndex" style="text-align: center;">
                        {{ cqUnit.quantity }}
                      </td>
                      <td>{{ formData.bq_quantity }}</td>
                      <td>{{ formData.adj_quantity }}</td>
                      <td v-for="(quotationData, qIndex) in QuotationName" :key="'rate-'+formIndex+'-'+qIndex" style="text-align: center;">
                        <input type="number" v-model="RateInput[formData.id]" @keydown="blockNegativeInput"   />
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;margin-right: 15px;">
              <div style="display: flex; align-items: center;">
                <label for="discount" style="margin-right: 5px;">Discount:</label>
                <input type="number" id="discount" v-model.number="discount" style="width: 94%;" @keydown="blockNegativeInput" />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;margin-right: 22px;">
              <div style="display: flex; align-items: center;">
                <label for="remark" style="margin-right: 5px;">Remarks:</label>
                <textarea 
                      id="remarks" 
                      v-model="remarks" 
                      style=" min-height: 70px; " >
                  </textarea>

              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;margin-right: 6px;">
              <div>
                <label for="documents" style="margin-right: 5px;">Documents:
                  <button v-if="QuotationName.length === 1 && QuotationName[0].document_api" 
            @click="downloadDocument(QuotationName[0].document_api)" 
            class="transparentButton" >
        <md-icon style="color: orange;margin-top: -5px;">file_present</md-icon>
    </button>
                </label>
                <input type="file" style="margin-top: 10px;" @change="handleFileChange">
                
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
import {  config } from "@/services";
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
      remarks: '',
      documents: {},
    };
  },
  mounted() {
    const id = this.$route.query.cqId;
    const subconListId = this.$route.query.sbConId;
    this.getNewDescription(id, subconListId);
  },
  methods: {
    async downloadDocument(url) {
      try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const fullUrl = `${apiHost}${url}`;

        const response = await fetch(fullUrl, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element, set its href to the blob URL, and click it to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = ''; // This will use the default filename from the server
        link.click();

        // Clean up
        URL.revokeObjectURL(blobUrl);

      } catch (error) {
        this.errorMessage = "Error issue: download document failed: " + error.message;
        console.error(this.errorMessage);
      }
    },
    blockNegativeInput(event) {
      if (event.key === '-' || event.key === 'Minus') {
        event.preventDefault();
      }
    },
    handleFileChange(event) {
      this.documents.file = event.target.files[0];
      
    },
    async getNewDescription(id, subconListId) {
      try {
        const processedData = await DescriptionController.getNewDescription(id);
        this.Description = processedData;
        processedData.forEach((formData) => {
          const cqUnitType = formData.cqUnitType;
          const getQuotation = formData.quotation;
          this.Unittype = cqUnitType;

          const filteredQuotations = getQuotation.filter(quotationRate =>
            String(quotationRate.call_for_quotation_subcon_list_id) === String(subconListId)
          );


          if (filteredQuotations.length > 0) {
            this.QuotationName = filteredQuotations;

            console.log('Document Api',this.QuotationName[0].document_api);

            const QuotationRemark = this.QuotationName[0].Call_For_Quotation_Subcon_List;
           
            this.$set(this, 'remarks', QuotationRemark.remark || '');
            this.$set(this, 'discount', QuotationRemark.discount || '');
           
            filteredQuotations.forEach(quotation => {
              this.$set(this.RateInput, formData.id, quotation.quote_rate || '')
           
            });
          }
        });

      } catch (error) {
        this.FailMessage = "Error Message :",error;
      }
    },
    async saveAllData() {
      try {
        const subListId = this.$route.query.sbConId;
        const dataToSave = this.Description.map(formData => {
        const filteredQuotation = formData.quotation.find(quotation => {
          return String(quotation.call_for_quotation_subcon_list_id) === String(subListId);
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
        const remark = this.remarks;
        const Documents = this.documents;
        const SuccessMessage = await DescriptionController.editQuotation(dataToSave,discount, remark,Documents);
        const concatenatedMessage = SuccessMessage.join(', ');
        const Message = concatenatedMessage.split(',')[0].trim();
        this.UpdateMessage = Message;
        const storedProjectId = localStorage.getItem('projectId');
        this.$router.push({ name: 'Subcon Comparison', query: { cqID: this.$route.query.cqId,projectID: storedProjectId  } }); 
        
      } catch (error) {
        this.FailMessage = "Failed to save data.";
      }
    },
  },
};
</script>

