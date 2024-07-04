<template>
  <div class="content">
    <!-- Modal -->
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h1 class="titleHeader">Select Subcon</h1><br>
        <input type="text" v-model="searchTerm" placeholder="Search subcon name then select the subcon" class="dropdownSubcon"
        style="width: 64%;"><br><br>
        <div v-if="filteredSubconData.length > 0" style="height: 60%;">
          <div class="tooltip" >
            <span style="position: absolute;margin-top: 5px;margin-left: 10px;"  v-if="!selectedOption">Select Subcon</span>
            <select class="dropdownSubcon" v-model="selectedOption" style="height: 29px;width: 188px;" >
            <option v-for="(subconData, index) in filteredSubconData" :key="index" :value="subconData.name">{{ subconData.name }}</option>
            </select>
          </div>
        <button class="btn-confirm" @click="confirmSubconSelection">Confirm</button>
        </div>
        <div v-else>
          <p style="color: red;">No results found.</p>
        </div>
      </div>
    </div>



    <div v-if="UpdateMessage" class="notification success">
      {{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon>
    </div>
    <div v-if="FailMessage" class="notification fail">
      {{ FailMessage }} <md-icon>cancel</md-icon>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px">
        <label style="margin-right: 10px; float: right" class="file-label">
          <div class="tooltip" >
            <span class="tooltiptext" style="bottom: -238% !important;">Upload quotation excel.</span>
          <md-icon class="mdIcon">upload_file</md-icon></div>
          <input type="file" multiple @change="importDataFromFiles" />
        </label>
        <button @click="downloadExcelTemplate" class="transparentButton" style="margin-right: 10px; float: right">
          <div class="tooltip" >
            <span class="tooltiptext" style="bottom: -297% !important;">Download quotation template and field in rate data.</span>
          <md-icon class="mdIcon">download_for_offline</md-icon></div>
        </button>
        <md-card>
          <md-card-content>
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
                    <th style="text-align: center;">{{ selectedSubconName }}
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
                <tbody>
                </tbody>
              </table>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <div style="display: flex; align-items: center;">
                <label for="discount" style="margin-right: 5px;">Discount:</label>
                <input type="number" id="discount" v-model.number="discount" style="width: 94%;" min="0" />
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

export default {
  data() {
    return {
      cqId: 0,
      UpdateMessage: null,
      FailMessage: null,
      cqUnit: [],
      columnKTitle: [],
      columnKData: [],
      selectedOption: null,
      selectedSubconName: '',
      searchTerm: '',
      QuotationDataArray: [],
      isModalVisible: false,
      remarks: "",
      discount: 0,
      documents: {},
    };
  },
  mounted() {
    const id = this.$route.query.cqId;
    this.getNewDescription(id)
      .then(() => {
        this.generateTable(this.Description, id);
        if (!this.selectedSubconName) {
          this.isModalVisible = true;
        }
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
    },
    filteredSubconData() {
      // Filter subconData based on searchTerm
      return this.columnKTitle.filter(subconData => {
        return subconData.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  },
  methods: {
    handleFileChange(event) {
      this.documents.file = event.target.files[0];
      
    },
    confirmSubconSelection() {
      if (this.selectedOption) {
        this.selectedSubconName = this.selectedOption;
        this.isModalVisible = false;
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

          const allValuesAtRateIndex = jsonData.map(row => row[rateIndex]);

          const finalColumnKData = allValuesAtRateIndex.filter(value => {
            return typeof value === 'number' || (typeof value === 'string' && /[0-9]/.test(value));
          });

          const columnKData = finalColumnKData.map(value => {
            if (typeof value === 'string') {
              const numericPart = value.match(/-?\d+(\.\d+)?/); 
              return numericPart ? parseFloat(numericPart[0]) : NaN;
            } else if (typeof value === 'number') {
              return value; 
            } else {
              return NaN; 
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
            <td style="white-space: pre-wrap;"><b>${formData.description_item}</b></td>
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
            unitQuantityTDs += `<td style="text-align:center;">${cqUnit.adjQty}</td>`;
          });

          const head2Row = document.createElement('tr');
          head2Row.innerHTML = ` 
            <td>${head1Counter}.${head2Counter}</td>
            <td>${formData.element || ''}</td>
            <td>${formData.sub_element || ''}</td>
            <td>${formData.description_sub_sub_element || ''}</td>
            <td style="padding-left:60px !important;white-space: pre-wrap;">${formData.description_item}</td>
            <td>${formData.description_unit || ''}</td> 
            ${unitQuantityTDs}
            <td>${formData.adj_quantity}</td>
            <td style="text-align:center;">${columnKData[columnKDataIndex] !== undefined ? columnKData[columnKDataIndex] : ''}</td>
          `;
          tableBody.appendChild(head2Row);

          if (columnKData[columnKDataIndex] !== '') {
            this.QuotationDataArray.push({
              description_id: formData.id,
              countData: count,
              rateData: rateCount,
              quotationName: this.selectedSubconName,
              rate: columnKData[columnKDataIndex],
            });
          }

          columnKDataIndex++;
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
            const SubConName = this.selectedSubconName;
            const Discount = this.discount;
            const Remarks = this.remarks;
            const Documents = this.documents;

            console.log('QuotationData',QuotationData);

            const hasNegativeRate = QuotationData.some(data => data.rate < 0);
            if (hasNegativeRate) {
                this.FailMessage = "Error: Rate data cannot have negative values.";
                setTimeout(() => {
                    this.UpdateMessage = '';
                    window.scrollTo(0, 0); 
                    window.location.reload();
                }, 2000);
                return;
            }

            if (QuotationData.rateData === QuotationData.countData && QuotationData.rateData != 0) {
              
              const SuccessMessage = await QuotationController.addQuotation(QuotationData,SubConName,Discount,Remarks,Documents,id);
              const concatenatedMessage = SuccessMessage.join(', ');
              this.UpdateMessage = concatenatedMessage.split(',')[0].trim();
              setTimeout(() => {
                this.UpdateMessage = '';
              }, 2500);
              const routeData = this.$router.resolve({
                  name: 'Subcon Comparison',
                  query: { cqID: this.$route.query.cqId }
              });

               window.open(routeData.href, '_blank');
            } else {
              this.FailMessage = "Error: Rate data is empty";
              setTimeout(() => {
                this.UpdateMessage = '';
                window.location.reload();
              }, 2000);
            }


        } catch (error) {
            this.FailMessage = error.message;
            setTimeout(() => {
              this.UpdateMessage = '';
              window.location.reload();
            }, 2000);
        }
    },
    // downloadExcelTemplate() {
    //   const dataTable = this.$refs.dataTable;

    //   if (!dataTable) {
    //     console.error("Data table reference not found.");
    //     return;
    //   }

    //   const clonedTable = dataTable.cloneNode(true);

    //   if (!clonedTable) {
    //     console.error("Cloned table not created.");
    //     return;
    //   }

    //   // Remove IDs to avoid duplicate elements in the document
    //   clonedTable.querySelectorAll('[id]').forEach(element => {
    //     element.removeAttribute('id');
    //   });

    //   // Create a new workbook and add a worksheet
    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet('Sheet1');

    //   // Add table rows to the worksheet, skipping the first row
    //   const rows = clonedTable.querySelectorAll('tr');
    //   rows.forEach((row, index) => {
    //     if (index === 0) return; // Skip the first row
    //     const cells = Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent.trim());
    //     worksheet.addRow(cells);
    //   });

    //   // Lock cells with text or numbers and leave blank cells unlocked
    //   worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    //     row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    //       if (cell.value !== null && cell.value !== undefined && cell.value.toString().trim() !== '') {
    //         cell.protection = { locked: true };  
    //       } else {
    //         cell.protection = { locked: false };  
    //       }
    //     });
    //   });

    //   // Protect the sheet
    //   worksheet.protect('12345', {
    //     selectLockedCells: false,
    //     selectUnlockedCells: true,
    //     formatCells: false,
    //     formatColumns: false,
    //     formatRows: false,
    //     insertColumns: false,
    //     insertRows: false,
    //     insertHyperlinks: false,
    //     deleteColumns: false,
    //     deleteRows: false
    //   });

    //   // Write the workbook to a file
    //   workbook.xlsx.writeBuffer().then(buffer => {
    //     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //     const link = document.createElement('a');
    //     link.href = URL.createObjectURL(blob);
    //     link.download = 'Quotation.xlsx';
    //     link.click();
    //   }).catch(err => {
    //     console.error(err);
    //   });
    // }
    downloadExcelTemplate() {
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

  // Remove IDs to avoid duplicate elements in the document
  clonedTable.querySelectorAll('[id]').forEach(element => {
    element.removeAttribute('id');
  });

  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Retrieve column widths from the original table
  const colWidths = Array.from(clonedTable.querySelectorAll('tr:first-child th')).map(th => {
    const style = window.getComputedStyle(th);
    const width = style.width.replace('px', '');
    return parseFloat(width);
  });

  // Add table rows to the worksheet, skipping the first row
  const rows = clonedTable.querySelectorAll('tr');
  rows.forEach((row, index) => {
    if (index === 0) return; // Skip the first row
    const cells = Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent.trim());
    worksheet.addRow(cells);
  });

  // Set the column widths in the worksheet
  worksheet.columns = worksheet.columns.map((col, index) => ({
    ...col,
    width: colWidths[index] / 7.5 // Convert px to Excel width (approximation)
  }));

  // Lock cells with text or numbers and leave blank cells unlocked
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (cell.value !== null && cell.value !== undefined && cell.value.toString().trim() !== '') {
        cell.protection = { locked: true };
      } else {
        cell.protection = { locked: false };
      }
    });
  });

  // Protect the sheet
  worksheet.protect('12345', {
    selectLockedCells: false,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertColumns: false,
    insertRows: false,
    insertHyperlinks: false,
    deleteColumns: false,
    deleteRows: false
  });

  // Write the workbook to a file
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Quotation.xlsx';
    link.click();
  }).catch(err => {
    console.error(err);
  });
}

  },
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  text-align: center;
  width: 500px;
  overflow-y: clip;
  height: 250px;
}


</style>
