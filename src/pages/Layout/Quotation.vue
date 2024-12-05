<template>
  <div class="content">
    <!-- Modal -->
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content" style="max-height: 400px;">
        <div class="modal-header">
          <h1 class="titleHeader">Select Subcon</h1>
          <span class="close-icon" @click="closeModal">&times;</span>
        </div><br>
        <input type="text" v-model="searchTerm" placeholder="Search subcon name then select the subcon" class="dropdownSubcon" style="width: 59%;height: 15%;"><br><br>
        <div v-if="filteredSubconData.length > 0" style="height: 60%;">
          <div class="tooltip">
            <span style="position: absolute;margin-top: 8px;margin-left: 10px;" v-if="!selectedOption">Select Subcon</span>
            <select class="dropdownSubcon" v-model="selectedOption" style="height: 32px;width: 278px;">
              <option v-for="(subconData, index) in filteredSubconData" :key="index" :value="subconData.name">{{ subconData.name }}</option>
            </select>
          </div>

          <div class="file-upload-container" v-if="selectedOption">
            <label for="fileInput">Quotation Name: </label>
            <input type="text" id="quotationName" v-model="quotationName" placeholder="Enter quotation name">
          </div>
          
          <!-- File input section -->
          <div class="file-upload-container" v-if="selectedOption">
            <label for="fileInput">Upload File: </label>
            <input type="file" multiple @change="importDataFromFiles" />
          </div>
          <button class="btn-confirm" @click="confirmSubconSelection" v-if="selectedOption" style="margin-left: 41%;">Confirm</button>
        </div>
        <div v-else>
          <p style="color: red;">No results found.</p>
        </div>
      </div>
    </div>

    <div v-if="isLoading"><loading-modal /><br><br></div>


    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px"> 
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <!-- Left Section (Undo Button) -->
          <div>
            <button @click="backToComparison" class="transparentButton" style="margin-left: 10px;">
              <div class="tooltip">
                <span class="tooltiptext" style="width: 160px; margin-left: -29px !important; margin-bottom: -105px;">
                  Back to comparison pages.
                </span>
                <md-icon class="mdIcon">arrow_back_ios</md-icon>
              </div>
            </button>
          </div>

          <!-- Right Section (Upload and Download Buttons) -->
          <div style="display: flex; gap: 10px;">
            <button @click="downloadExcelTemplate" class="transparentButton">
              <div class="tooltip">
                <span class="tooltiptext" style="bottom: -305% !important;">
                  Download quotation template and field in rate data.
                </span>
                <md-icon class="mdIcon">download_for_offline</md-icon>
              </div>
            </button>
            
            <button @click="openModal" class="transparentButton">
              <div class="tooltip">
                <span class="tooltiptext" style="bottom: -310% !important;">
                  Select subcon and upload quotation excel.
                </span>
                <md-icon class="mdIcon">upload_file</md-icon>
              </div>
            </button>

            
          </div>
        </div>
        <md-card>
          <md-card-content>
            <div v-if="UpdateMessage" class="notification success">
              {{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon><br>
            </div>
            <div v-if="FailMessage" class="notification fail">
              {{ FailMessage }} <md-icon>cancel</md-icon><br>
            </div>
            <div class="table-container" style="margin-top: 0px !important;">
              <table class="nested-table" id="data-table" ref="dataTable">
                <thead>
                  <tr>
                    <th colspan="6"></th>
                    <th v-for="(unitdata, index) in getCqUnitTypes" :key="index" style="text-align: center;">
                      <div class="tooltip" >
                        <span class="tooltiptext" style="bottom: -127px;">Using adj factor to calculate quantity.</span>
                        <md-icon style="color: red;">priority_high</md-icon></div>
                    </th>
                    <th scope="col">
                      <div class="tooltip">
                      <span class="tooltiptext" style="bottom: -127px;">Using adj factor to calculate quantity.</span>
                      <md-icon style="color: red;">priority_high</md-icon></div>
                    </th>
                    <th></th>
                  </tr>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Element</th>
                    <th scope="col">Sub Element</th>
                    <th scope="col">Sub Sub Element</th>
                    <th scope="col">Description</th>
                    <th scope="col">Unit</th>
                    <th v-for="(unitdata, index) in getCqUnitTypes" :key="index" style="text-align: center;">
                    {{ unitdata.cqUnitType.type }}({{ unitdata.cqUnitType.quantity }})
                    </th>
                    <th scope="col">Qty</th>
                    <th style="text-align: center;">
                      {{ quotationName && selectedSubconName ? `${selectedSubconName} (${quotationName})` : `${selectedSubconName}` }}
                    </th>
                  </tr>
                  <tr>
                    <th></th><th></th><th></th><th></th><th></th><th></th>
                    <th v-for="(unitdata, index) in getCqUnitTypes" :key="index" style="text-align: center;">
                      
                    </th>
                    <th scope="col"></th>
                    <th scope="col">Rate</th>
                  </tr>
                </thead>
                <tbody >
                </tbody>
              </table>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <div style="display: flex; align-items: center;">
                <label for="discount" style="margin-right: 5px;">Discount:</label>
                <input type="number" id="discount" v-model.number="discount" style="width: 94%;" min="0" @keydown="blockNegativeInput" />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <div style="display: flex; align-items: center;">
                <label for="remarks" style="margin-right: 5px;">Remarks:</label>
                <input type="text" id="remarks" v-model.number="remarks" style="width: 94%;" />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;margin-right: -13px;">
              <div>
                <label for="documents" style="margin-right: 5px;">Documents:</label>
                <input type="file" @change="handleFileChange">
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
const XLSX = require('xlsx');
import DescriptionController from "@/services/controllers/DescriptionController.js";
import QuotationController from "@/services/controllers/QuotationController.js";
import SubconController from "@/services/controllers/SubconController.js";
import ExcelJS from "exceljs";
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";

export default {
  components: {
    LoadingModal,
  },
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
      cqUnit: [],
      columnKTitle: [],
      valueImportRate: [],
      selectedOption: null,
      selectedSubconName: '',
      quotationName: '',
      searchTerm: '',
      QuotationDataArray: [],
      isModalVisible: false,
      remarks: "",
      discount: 0,
      documents: {},
      isLoading: false,
    };
  },
  mounted() {
    const id = this.$route.query.cqId;
    this.getNewDescription(id)
      .then(() => {
        this.generateTable(this.Description, id);
      })
      .catch(error => {
        this.FailMessage = ('Error fetching Description:', error);
        this.FailMessage = error.message;
      });
    this.accessSubcon();
  },
  computed: {
    getCqUnitTypes() {
      return this.cqUnit.length > 0 ? this.cqUnit : [];
    },
    filteredSubconData() {
      // Filter subconData based on searchTerm
      return this.columnKTitle.filter(subconData => {
        return subconData.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  },
  methods: {
    backToComparison() {
      const id = this.$route.query.cqId;
      const storedProjectId = localStorage.getItem('projectId');
      this.$router.push({
        path: '/comparison',
        query: { cqID: id, projectID: storedProjectId }
      });
    },
    blockNegativeInput(event) {
      if (event.key === '-' || event.key === 'Minus') {
        event.preventDefault();
      }
    },
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    handleFileChange(event) {
      this.documents.file = event.target.files[0];
      
    },
    confirmSubconSelection() {
      if (this.selectedOption) {
        this.selectedSubconName = this.selectedOption; 
        this.isModalVisible = false;

        // Ensure to pass event to importDataFromFiles
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
          const event = { target: { files: fileInput.files } };
          this.importDataFromFiles(event);
        } else {
          this.FailMessage = ("No file selected.");
          // Handle case where no file is selected
        }
      } else {
        this.FailMessage = ("No subcontractor selected.");
        // Handle case where no subcontractor is selected
      }
    },
    async accessSubcon() {
      try {
        const processedData = await SubconController.accessSubcon();
        this.columnKTitle = processedData.filter(subcon => subcon.id !== 1);
      } catch (error) {
        this.errorMessage = "Error fetching subcon data: " + error.errorMessage;
      }
    },
    async getNewDescription(id) {
      try {
        this.isLoading = true;
        const processedData = await DescriptionController.getNewDescription(id);
        this.Description = processedData;
        this.cqUnit = processedData[0].cqUnitType || [];
      } catch (error) {
        this.FailMessage = ('Error fetching Description:', error);
        throw error;
      } finally{
        this.isLoading = false;
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
          const valueImportRate = jsonData.slice(2) // Skip the first two rows (headers)
          .map((row, index) => {
            const Importrate = row[rateIndex];
            let numericValue;

            // Check if the rate is empty, null, or undefined
            if (Importrate === '' || Importrate === null || Importrate === undefined) {
              numericValue = 0; // Assign 0 if Importrate is empty or invalid
            } else if (typeof Importrate === 'string') {
              const numericPart = Importrate.match(/-?\d+(\.\d+)?/);
              numericValue = numericPart ? parseFloat(numericPart[0]) : 0; // Return 0 if no valid numeric part
            } else if (typeof Importrate === 'number') {
              numericValue = Importrate;
            } else {
              numericValue = 0; // Default to 0 for any other case
            }

            return numericValue; // Return the numeric value
          })
          .filter(value => !isNaN(value)); // Only keep valid numeric values

          if (valueImportRate.length !== this.Description.length) {
            this.FailMessage = "Error: Template format doesnt match the table view. Please re-download and upload again.";
            setTimeout(() => {
              this.UpdateMessage = '';
              window.scrollTo(0, 0); 
              window.location.reload();
            }, 2500);
            return;
          } else {
            this.valueImportRate = valueImportRate;
            this.generateTable(this.Description, this.$route.query.cqId, valueImportRate);
          }

          
        
        };
        reader.readAsArrayBuffer(file);
      });
    },
    generateTable(data, id, valueImportRate) {
      const filteredFormData = data.filter(item => {
        if (item.quotation && item.quotation.length > 0) {
          if (item.quotation[0].total_quote_amount !== 0) {
            return true;
          }
        }
        return false;
      });
      const tableBody = document.querySelector('#data-table tbody');
      let head1Counter = 0;
      let head2Counter = 0;
      let prevHead1 = null;
      let prevHead2 = null;
      tableBody.innerHTML = '';

      if (!Array.isArray(valueImportRate) || valueImportRate.length === 0) {
        valueImportRate = new Array(data.length).fill('');
       
      }

      let valueImportRateIndex = 0;

      data.forEach((formData, dataIndex) => {
        const cqUnitType = formData.cqUnitType;
        const getQuotation = formData.quotation;

        
        if (!formData.description_unit) {
          head1Counter++;
          prevHead1 = formData.description_item;

          const head1Row = document.createElement('tr');
          head1Row.innerHTML = `
            <td><b>${head1Counter}</b></td>
            <td><b>${formData.element || ''}</b></td>
            <td><b>${formData.sub_element || ''}</b></td>
            <td><b>${formData.description_sub_sub_element || ''}</b></td>
            <td class="td-max-width"><b>${formData.description_item}</b></td>
          `;
          tableBody.appendChild(head1Row);

          head2Counter = 0;
          prevHead2 = null;
        }else {
          head2Counter++;
          prevHead2 = formData.description_item;

          let unitQuantityTDs = '';
          cqUnitType.forEach(cqUnit => {
            unitQuantityTDs += `<td style="text-align:center;">${cqUnit.adj_quantity}</td>`;
          });

          const head2Row = document.createElement('tr');
          const numberOfDescription = dataIndex;  
          const numberOfSubcon = valueImportRate.map((value, index) => index);

          // Default to an empty string
          let rateValueTable = '';  

          if (numberOfSubcon.includes(numberOfDescription)) {
            rateValueTable = valueImportRate[numberOfDescription];  
          }

          head2Row.innerHTML = ` 
            <td>${head1Counter}.${head2Counter}</td>
            <td>${formData.element || ''}</td>
            <td>${formData.sub_element || ''}</td>
            <td>${formData.description_sub_sub_element || ''}</td>
            <td style="padding-left:30px !important;"  class="td-max-width">${formData.description_item}</td>
            <td>${formData.description_unit || ''}</td> 
            ${unitQuantityTDs}
            <td>${formData.adj_quantity}</td>
            <td style="text-align:center;">
              ${typeof rateValueTable === 'number' && !isNaN(rateValueTable) ? rateValueTable.toFixed(2) : ''}
            </td>
          `;
          tableBody.appendChild(head2Row);

          if (valueImportRate[valueImportRateIndex] !== '') {
            const existingEntry = this.QuotationDataArray.find(entry => entry.description_id === formData.id);
            if (!existingEntry) {
              this.QuotationDataArray.push({
                description_id: formData.id,
                rate: rateValueTable,
              });
            }
          }


          valueImportRateIndex++;
        }
      });
    },
    async saveAllData() {
      try {
        await this.saveData(this.QuotationDataArray,this.$route.query.cqId);
        
      } catch (error) {
        this.$emit('fail-message', error.message);
      }
    },
    async saveData(QuotationData,id) {
        try {
            this.isLoading = true;
            window.scrollTo(0, 0);
            const SubConName = this.selectedSubconName;
            const QuotationName = this.quotationName;
            const Discount = this.discount;
            const Remarks = this.remarks;
            const Documents = this.documents;
            const hasInvalidRate = QuotationData.some(data => data.rate < 0);
            if (hasInvalidRate) {
                this.FailMessage = "Error: Rate data cannot have negative values.";
                setTimeout(() => {
                    this.UpdateMessage = '';
                    window.scrollTo(0, 0); 
                    window.location.reload();
                }, 2000);
                return;
            }
          
              const SuccessMessage = await QuotationController.addQuotation(QuotationData,SubConName,Discount,Remarks,Documents,id,QuotationName);
              const concatenatedMessage = SuccessMessage.join(', ');
              this.UpdateMessage = concatenatedMessage.split(',')[0].trim();
              window.scrollTo(0, 0); 
              const storedProjectId = localStorage.getItem('projectId');
             
              this.$router.push({
                  name: 'Subcon Comparison',
                  query: { cqID: this.$route.query.cqId, 
                    projectID: storedProjectId }
              });
             
        } catch (error) {
            this.FailMessage = error.message;
            setTimeout(() => {
              this.UpdateMessage = '';
              window.scrollTo(0, 0); 
              window.location.reload();
            }, 2000);
        } finally {
          this.isLoading = false;
        }
    },
    downloadExcelTemplate() {
      const dataTable = this.$refs.dataTable;

      if (!dataTable) {
        this.FailMessage = "Data table reference not found.";
        return;
      }

      const clonedTable = dataTable.cloneNode(true);

      if (!clonedTable) {
        this.FailMessage = "Cloned table not created.";
        return;
      }

      // Remove IDs to avoid duplicate elements in the document
      clonedTable.querySelectorAll('[id]').forEach(element => {
        element.removeAttribute('id');
      });

      // Create a new workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');

      // Add table rows to the worksheet, skipping the first row
      const rows = clonedTable.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index === 0) return; // Skip the first row
        const cells = Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent.trim());
        worksheet.addRow(cells);
      });

      // Write the workbook to a file
      workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Quotation.xlsx';
        link.click();
      }).catch(err => {
        this.FailMessage = err;
      });
    }

  },
};
</script>


<style scoped>


.modal-content {
  text-align: center;
  width: 500px;
  overflow-y: clip;
  height: 350px;
  position: relative;
}

.file-upload-container {
  display: flex;
  align-items: center;
  margin: 20px 0px 18px 97px;
}

.close-icon {
  position: absolute;
    top: 28px;
    right: 27px;
    font-size: 26px;
    cursor: pointer;
}



</style>
