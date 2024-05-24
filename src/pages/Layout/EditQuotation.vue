<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px">
        <md-card>
          <md-card-content>
            <div class="table-container">
              <table class="nested-table" id="data-table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Element</th>
                    <th scope="col">Sub Element</th>
                    <th scope="col">Sub Sub Element</th>
                    <th scope="col">Description</th>
                    <th scope="col">Unit</th>
                    <th v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.cqUnitType.type }}</th>
                    <th scope="col">BQ QTY</th>
                    <th scope="col">(ADJ) QTY</th>
                    <th scope="col" v-for="(quotationData, index) in QuotationName" :key="index" style="text-align: center;">
                      {{ quotationData.Call_For_Quotation_Subcon_List.subcon_id }}
                    </th>
                  </tr>
                  <tr>
                    <th></th>
                    <th colspan="5"></th>
                    <th scope="col" v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.cqUnitType.quantity }}</th>
                    <th colspan="2"></th>
                    <th scope="col" style="text-align: center;">Rate</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
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
import QuotationController from "@/services/controllers/QuotationController.js";

export default {
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
      Unittype: [],
      QuotationName: [],
      quotationRateInput: {}, // Store quotation rate inputs here
    };
  },
  mounted() {
    const id = this.$route.query.cqId;
    const subconId = this.$route.query.sbConId;
    this.getNewDescription(id)
      .then(() => {
        this.generateTable(this.Description, id, subconId);
      })
      .catch(error => {
        console.error('Error fetching Description:', error);
        this.FailMessage = error.message;
      });
  },
  methods: {
    async getNewDescription(id) {
      try {
        const processedData = await DescriptionController.getNewDescription(id);
        this.Description = processedData;
      } catch (error) {
        console.error('Error fetching Description:', error);
        throw error;
      }
    },
    generateTable(data, id, subconId) {
  const tableBody = document.querySelector('#data-table tbody');
  let head1Counter = 0;
  let head2Counter = 0;
  tableBody.innerHTML = '';

  data.forEach((formData) => {
    const cqUnitType = formData.cqUnitType;
    const getQuotation = formData.quotation;
    this.Unittype = cqUnitType;
    const filteredQuotations = getQuotation.filter(quotationRate => {
      return String(quotationRate.Call_For_Quotation_Subcon_List.subcon_id) === String(subconId);
    });

    this.QuotationName = filteredQuotations;

    if (formData.bq_quantity === 0) {
      head1Counter++;
      const head1Row = document.createElement('tr');
      head1Row.innerHTML = `
        <td><b>${head1Counter}</b></td>
        <td><b>${formData.element || ''}</b></td>
        <td><b>${formData.sub_element || ''}</b></td>
        <td><b>${formData.description_sub_sub_element || ''}</b></td>
        <td><b>${formData.description_item}</b></td>
        <td><b>${formData.description_unit || ''}</b></td>
      `;
      tableBody.appendChild(head1Row);
      head2Counter = 0;
    }

    if (formData.bq_quantity !== 0) {
      head2Counter++;

      let unitQuantityTDs = '';
      cqUnitType.forEach((cqUnit) => {
        unitQuantityTDs += `<td style="text-align:center;">${cqUnit.quantity}</td>`;
      });

      let quotationTDs = '';
      filteredQuotations.forEach((quotationRate) => {
        // Initialize input model if not already initialized
        if (!this.quotationRateInput.hasOwnProperty(quotationRate.id)) {
          this.$set(this.quotationRateInput, quotationRate.id, '');
        }
        quotationTDs += `
          <td style="text-align:center;">
            <input type="number" value=${quotationRate.quote_rate} />
          </td>`;
      });

      const head2Row = document.createElement('tr');
      head2Row.innerHTML = `
        <td>${head1Counter}.${head2Counter}</td>
        <td>${formData.element || ''}</td>
        <td>${formData.sub_element || ''}</td>
        <td>${formData.description_sub_sub_element || ''}</td>
        <td style="padding-left:60px !important;">${formData.description_item}</td>
        <td>${formData.description_unit || ''}</td>
        ${unitQuantityTDs}
        <td>${formData.bq_quantity}</td>
        <td>${formData.adj_quantity}</td>
        ${quotationTDs}
      `;
      tableBody.appendChild(head2Row);
    }
  });
},

async saveAllData() {
    // Create an array to store input values
    const inputValues = [];

    // Iterate over the quotationRateInput object to extract input values
    for (const key in this.quotationRateInput) {
      if (Object.hasOwnProperty.call(this.quotationRateInput, key)) {
        const inputValue = this.quotationRateInput[key];
        inputValues.push(inputValue);
      }
    }

    // Log the input values to verify
    console.log('Input values:', inputValues);

    // Perform additional processing or send data to server as needed
  },

    async saveData(QuotationData) {
    },
  },
};


</script>