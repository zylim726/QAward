<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px">
        <label style="margin-right: 10px; float: right" class="file-label">
          <md-icon class="mdIcon">upload_file</md-icon>
          <input type="file" multiple @change="importDataFromFiles" />
        </label>
        <button @click="downloadExcelTemplate" class="transparentButton" style="margin-right: 10px; float: right">
          <md-icon class="mdIcon">download_for_offline</md-icon>
        </button>
        <md-card>
          <md-card-content>
            <div class="table-container" style="    margin-top: 0px !important;">
              <table  class="nested-table" id="data-table" ref="dataTable">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Element</th>
                    <th scope="col">Sub Element</th>
                    <th scope="col">Sub Sub Element</th>
                    <th scope="col">Description</th>
                    <th scope="col">Unit</th>
                    <th v-for="(unitdata, index) in getCqUnitTypes" :key="index" style="text-align: center;">
                      {{ unitdata.cqUnitType.type }}
                    </th>
                    <th scope="col">BQ Qty</th>
                    <th scope="col">(ADJ) QTY</th>
                    <th style="text-align: center;">
                      <p>Selected Subcon</p>
                      <select v-model="selectedOption">
                        <option v-for="(subconData, index) in columnKTitle" :key="index" required>{{ subconData.name }}</option>
                      </select>

                    </th>
                  </tr>
                  <tr>
                    <th colspan="6"></th>
                    <th v-for="(unitdata, index) in getCqUnitTypes" :key="index" style="text-align: center;">
                      {{ unitdata.cqUnitType.quantity }}
                    </th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">Rate</th>
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
const XLSX = require('xlsx');
import DescriptionController from "@/services/controllers/DescriptionController.js";
import QuotationController from "@/services/controllers/QuotationController.js";
import SubconController from "@/services/controllers/SubconController.js";

export default {
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
      cqUnit: [],
      columnKTitle: [],
      columnKData: [],
      selectedOption: [],
      QuotationDataArray: [], 
    };
  },
  mounted() {
    const id = this.$route.query.cqId;
    this.getNewDescription(id)
      .then(() => {
        this.generateTable(this.Description, id);
      })
      .catch(error => {
        console.error('Error fetching Description:', error);
        this.FailMessage = error.message;
      });
    this.accessSubcon();
  },
  computed: {
    getCqUnitTypes() {
      return this.cqUnit.length > 0 ? this.cqUnit : [];
    }
  },
  methods: {
    async accessSubcon(){
      try {
        const processedData = await SubconController.accessSubcon();
        this.columnKTitle = processedData.filter(subcon => subcon.id !== 1);
      } catch (error) {
        this.errorMessage = "Error fetching subcon data: " + error.errorMessage;
      }
    },
    async getNewDescription(id) {
      try {
        const processedData = await DescriptionController.getNewDescription(id);
        this.Description = processedData;
        this.cqUnit = processedData[0].cqUnitType || [];
      } catch (error) {
        console.error('Error fetching Description:', error);
        throw error;
      }
    },
    importDataFromFiles(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const rateIndex = jsonData[1].indexOf('Rate');

          const allValuesAtRateIndex = jsonData.map(row => row[rateIndex]);;
        
          const finalColumnKData = allValuesAtRateIndex.filter(value => {
            return typeof value === 'number' || (typeof value === 'string' && /[0-9]/.test(value));
          });

          const columnKData = finalColumnKData.map(value => {
            if (typeof value === 'string') {
              const numericPart = value.match(/\d+/);
              return numericPart ? parseFloat(numericPart[0]) : NaN;
            } else {
              return value;
            }
           });
          this.columnKData = columnKData;
          this.generateTable(this.Description, this.$route.query.cqId, columnKData);

        };
        reader.readAsArrayBuffer(file);
      });
    },
    generateTable(data, id, columnKData) {
  
      const filteredFormData = data.filter(item => {
        if (item.quotation && item.quotation.length > 0) {
          if (item.quotation[0].total_quote_amount !== 0) {
            return true;
          }
        }
        return false;
      });

      const count = filteredFormData.length;
      const rateCount = columnKData ? columnKData.length : 0;
      const tableBody = document.querySelector('#data-table tbody');
      let head1Counter = 0;
      let head2Counter = 0;
      let prevHead1 = null;
      let prevHead2 = null;
      tableBody.innerHTML = '';

      if (!Array.isArray(columnKData) || columnKData.length === 0) {
        columnKData = new Array(data.length).fill('');
      }

      let columnKDataIndex = 0;

      data.forEach((formData, dataIndex) => {
        const cqUnitType = formData.cqUnitType;
        const getQuotation = formData.quotation;

        if (getQuotation.length <= 0 || getQuotation[0].total_quote_amount === 0) {
          head1Counter++;
          prevHead1 = formData.description_item;

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
          prevHead2 = null;
        }

        if (getQuotation.length > 0 && getQuotation[0].total_quote_amount !== 0) {
          head2Counter++;
          prevHead2 = formData.description_item;

          let unitQuantityTDs = '';
          cqUnitType.forEach(cqUnit => {
            unitQuantityTDs += `<td style="text-align:center;">${cqUnit.quantity}</td>`;
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
            <td style="text-align:center;">${columnKData[columnKDataIndex] !== undefined ? columnKData[columnKDataIndex] : ''}</td>
          `;
          tableBody.appendChild(head2Row);
  
          if (columnKData[columnKDataIndex] !== '') {
            this.QuotationDataArray.push({
              description_id: formData.id,
              countData: count,
              rateData: rateCount,
              quotationName: this.selectedOption,
              rate: columnKData[columnKDataIndex],
              cqId: id
            });
          }

          columnKDataIndex++;
        }
      });
    },
    async saveAllData() {
      try {
        for (const QuotationData of this.QuotationDataArray) {
          await this.saveData(QuotationData);
        }
      } catch (error) {
        this.$emit('fail-message', error.message);
      }
    },
    async saveData(QuotationData) {
      try {
         if (QuotationData.rateData === QuotationData.countData && QuotationData.quotationName.length > 0 && QuotationData.rateData != 0) {
          this.UpdateMessage = await QuotationController.addQuotation(QuotationData);
            setTimeout(() => {
            this.UpdateMessage = '';
            window.location.reload(); 
          }, 2000);
        }else {
          this.FailMessage = "Error: Some data is empty";
          setTimeout(() => {
            this.UpdateMessage = '';
            window.location.reload(); 
          }, 2000);
        }
          
      } catch (error) {
        this.FailMessage =  error.message;
          setTimeout(() => {
          this.UpdateMessage = '';
          window.location.reload(); 
        }, 2000);
      }
    },
    downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();
  const dataTable = this.$refs.dataTable;

  if (!dataTable) {
    console.error("Data table reference not found.");
    return;
  }

  const clonedTable = dataTable.cloneNode(true);

  if (!clonedTable) {
    console.error("Cloned table not created.");
    return;
  }

  // Show hidden elements before exporting
  const hiddenElements = clonedTable.querySelectorAll('[style*="display: none"]');
  hiddenElements.forEach(element => {
    element.style.display = '';
  });

  // Remove BQ QTY cells from the table
  clonedTable.querySelectorAll('td:nth-child(9), th:nth-child(9)').forEach(cell => {
    cell.parentNode.removeChild(cell);
  });

  // Remove IDs to avoid duplicate elements in the document
  clonedTable.querySelectorAll('[id]').forEach(element => {
    element.removeAttribute('id');
  });

  const ws = XLSX.utils.table_to_sheet(clonedTable);
  XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
  XLSX.writeFile(wb, 'comparisonTable.xlsx');

  // Restore hidden elements after exporting
  hiddenElements.forEach(element => {
    element.style.display = 'none';
  });
},


  }
};
</script>