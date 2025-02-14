<template>
  <div>
    <div v-if="isLoading">
      <loading-modal /><br><br>
    </div>
    <div class="notification fail" v-if="someUnitTypesZero">Warning: One or more unit type quantities are currently set to 0. Please check before importing the BQ items.</div>
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <!-- Left Section -->
      <div style="float: left;">
        <button @click="backToComparison" class="transparentButton" style="margin-left: 10px;">
          <div class="tooltip">
            <span class="tooltiptext" style="width: 160px; margin-left: -29px !important;">
              Back to comparison pages.
            </span>
            <md-icon class="mdIcon">arrow_back_ios</md-icon>
          </div>
        </button>
      </div>

      <!-- Right Section -->
      <div style="float: right;">
        <label for="desciptionInput" style="margin-right: 10px;" class="file-label">
          <div class="tooltip">
            <span class="tooltiptext" style="width: 160px; margin-left: -127px;">
              Upload your BQ Description.
            </span>
            <md-icon class="mdIcon">upload_file</md-icon>
          </div>
          <input id="desciptionInput" type="file" multiple @change="DescriptionUpload" />
        </label>

        <button @click="exportTableHeaders" class="transparentButton" style="margin-right: 10px;">
          <div class="tooltip">
            <span class="tooltiptext" style="width: 160px; margin-left: -110px !important;">
              Download BQ Template and field in data.
            </span>
            <md-icon class="mdIcon">download_for_offline</md-icon>
          </div>
        </button>
      </div>
    </div>

    <div class="projectTable-container">
      <table class="project-table">
        <thead>
          <tr>
            <th scope="col">
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="selectAllRows"
                />
              </label>
            </th>
            <th scope="col">Element</th>
            <th scope="col">Sub Element</th>
            <th scope="col">Sub Sub Element</th>
            <th scope="col">Description</th>
            <th scope="col">Unit</th>
            <th scope="col" v-for="(unitdata, index) in Unittype" :key="index">
              {{ unitdata.type }} ({{ unitdata.quantity }})
            </th>
            <th 
              scope="col" 
              v-for="(subcon, index) in SubconList.length > 0 ? SubconList : [{ Subcon: { name: 'Budget' } }]" 
              :key="index"
            >
              {{ subcon.Subcon.name }} <span v-if="subcon.name && subcon.Subcon.name !== 'Budget'">({{ subcon.name }})</span>
            </th>

          </tr>
        </thead>
        <tbody>
  <tr
    v-for="(row, rowIndex) in importedData"
    :key="rowIndex"
    :class="{ 'selected-row': row.selected }"
  >
    <td v-if="shouldDisplayCheckbox(row)">
      <label class="control control--checkbox">
        <input type="checkbox" v-model="row.selected" />
      </label>
    </td>
    <td v-else></td>
    <td
      v-for="(column, colIndex) in filteredColumns"
      :key="column"
      class="td-max-width"
    >
      {{ 
        (colIndex > 4 && !isNaN(row[column]) && row[column] !== "")
          ? parseFloat(row[column]).toFixed(2)
          : row[column]
      }}
    </td>
  </tr>
</tbody>

      </table>
    </div>
    <button type="submit" class="btn-save" @click="saveData">Save</button><br /><br />
  </div>
</template>


<script>
import Import from "papaparse";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";
import DescriptionController from "@/services/controllers/DescriptionController.js";
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";

export default {
  components: { LoadingModal },
  props: {
    cqId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      importedData: [],
      Unittype: [],
      SubconList: [],
      columnTitles: [],
      selectAll: true,
      isLoading: false,
    };
  },
  computed: {
    filteredColumns() {
      return this.columnTitles.filter((title) => !this.isBooleanColumn(title));
    },
    someUnitTypesZero() {
      const result = this.Unittype.some((unit) => Number(unit.quantity) === 0.00);
      return result;
    },
  },
  watch: {
    cqId(newValue, oldValue) {
      this.getUnittype(newValue);
    }
  },
  methods: {
    async getUnittype(id) {
      try {
        const processedData = await CallofQuotationController.getUnittype(id);
        this.Unittype = processedData.cqUnitTypes;
        this.SubconList = processedData.subconLists;
        console.log('this subconlist',this.SubconList);
      } catch (error) {
        const FailMessage = 'Error fetching Unittype: ' + error;
        this.$emit('fail-message', FailMessage);
      }
    },
    DescriptionUpload(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        Import.parse(file, {
          complete: (result) => {
            this.importData(result.data);
          },
          header: true,
        });
      }
    },
    importData(data) {
    const filteredData = data.filter(row => {
      // Filter out rows where all values are empty
      return Object.values(row).some(value => value !== '');
    });

    filteredData.forEach(row => {
        let count = 0; // Initialize a counter to track the position

        for (const key in row) {
          const value = row[key];
          // For the first five values, leave them as is
          if (count < 5) {
            row[key] = value; // No conversion for first 5 items
          } else {
            // For values after the fifth, check if they can be converted to a number
            if (!isNaN(parseFloat(value)) && isFinite(value)) {
              row[key] = parseFloat(value).toFixed(2); // Convert to number
            } else {
              row[key] = value; // Keep the original value if not numeric
            }
          }
          
          count++; // Increment the counter after processing each value
        }

        row.selected = true; // Mark the row as selected
      });


    this.importedData = [...this.importedData, ...filteredData];

    if (this.importedData.length > 0) {
      this.columnTitles = Object.keys(this.importedData[0]);
    }
  },
    selectAllRows() {
      if (this.importedData.length > 0) {
        this.importedData.forEach((row) => {
          row.selected = this.selectAll;
        });
      }
    },
    shouldDisplayCheckbox(row) {
      return true;
    },
    isBooleanColumn(key) {
      return this.importedData.some((row) => typeof row[key] === "boolean");
    },
    backToComparison() {
      const storedProjectId = localStorage.getItem('projectId');
      this.$router.push({
        path: '/comparison',
        query: { cqID: this.cqId, projectID: storedProjectId }
      });
    },
    exportTableHeaders() {
      try {
        const headers = []; 
        const thElements = document.querySelectorAll('thead th');

        thElements.forEach((th) => {
          if (th.textContent.trim() !== "") {
            headers.push(th.textContent.trim());
          }
        });

        const headersCSV = headers.join(',');

        const csvContent = "data:text/csv;charset=utf-8," + headersCSV;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "description_template.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        const FailMessage = "Error downloading template: " + error;
        this.$emit('fail-message', FailMessage);
      }
    },
    async saveData() {
      this.isLoading = true;
      const cqId = this.cqId;

      const selectImportData = this.importedData.filter(importedRow => importedRow.selected);
      const unittype = this.Unittype;
      const getSubconDetails = this.SubconList;


      const matchedData = [];
      let hasErrors = false;

      selectImportData.forEach(object => {
        const matchedValues = {};
        const getSubconValue = {};
        let checkDuplicateUnit = [];
        unittype.forEach(unit => {
          let unitTypeunitQuantity = `${unit.type} (${unit.quantity})`.replace(/\s+/g, ' ').trim();
          checkDuplicateUnit.push(unitTypeunitQuantity);
          // If unitTypeunitQuantity already exists, increment the count
          if(checkDuplicateUnit.filter(item => item === unitTypeunitQuantity).length > 1){
            unitTypeunitQuantity = unitTypeunitQuantity + "_" + (checkDuplicateUnit.filter(item => item === unitTypeunitQuantity).length - 1)
          } 
          // Clean the object keys by removing extra spaces
          const proceseedUnitKeys = Object.keys(object).reduce((acc, key) => {
            acc[key.replace(/\s+/g, ' ').trim()] = object[key];
            return acc;
          }, {});

          // If the unit type exists in the sanitized import data 
          if (proceseedUnitKeys.hasOwnProperty(unitTypeunitQuantity)) {
              let cleanUnitKeys = parseFloat(proceseedUnitKeys[unitTypeunitQuantity].replace(/,/g, ''));

              // Check if parsed value is a valid number
              if (isNaN(cleanUnitKeys) || cleanUnitKeys == null || cleanUnitKeys <= 0) {
                  matchedValues[unit.id] = '';  // Set as empty if no valid number or non-positive numbe
              } else {
                  matchedValues[unit.id] =   cleanUnitKeys;  
              }
          }


        });
        let valueSubconDetails;
        if (getSubconDetails.length === 0) {
            getSubconValue[0] = object["Budget"];
            valueSubconDetails = 1;
          } else {
            getSubconDetails.forEach(subcon => {
             
                valueSubconDetails = getSubconDetails.length;
                let getSubconObject;

                if (subcon.Subcon.name === 'Budget') {
                   getSubconObject = subcon.Subcon.name;
                    console.log('If Block - Budget:', getSubconObject);
                } else if (subcon.name && subcon.Subcon.name !== 'Budget') {
                  getSubconObject = subcon.Subcon.name + ' (' + subcon.name + ')';

                    console.log('Else If Block:', getSubconObject);
                } else {
                  getSubconObject = subcon.Subcon.name;
                    console.log('Else Block:', getSubconObject);  // This should log for all the remaining cases
                }


                // Clean the object keys by removing extra spaces
                const proceseedUnitKeys = Object.keys(object).reduce((acc, key) => {
                    acc[key.replace(/\s+/g, ' ').trim()] = object[key];
                    return acc;
                }, {});

                if (proceseedUnitKeys.hasOwnProperty(getSubconObject)) {
                    console.log('Found key in object:', getSubconObject);  // Debug log to verify key existence
                    
                    let cleanUnitKeys = parseFloat(proceseedUnitKeys[getSubconObject].replace(/,/g, ''));

                    // Check if parsed value is a valid number
                    if (isNaN(cleanUnitKeys) || cleanUnitKeys == null ) {
                        getSubconValue[subcon.id] = '';  // Set as empty if no valid number
                    } else {
                        getSubconValue[subcon.id] = cleanUnitKeys;  
                    }
                }

            });
        }


        

      //Check if Budget Rate is negative
      for (const key in getSubconValue) {
        if (getSubconValue[key] < 0) {
          this.$emit('fail-message', "Budget rate cannot have negative rate.");
          hasErrors = true;
          return;
        }
      }

      // Check if any of the matched unit quantities are negative
      for (const key in matchedValues) {
        if (matchedValues[key] < 0) {
          this.$emit('fail-message', "Unit type quantity cannot have negative rate.");
          hasErrors = true;
          return;
        }
      }

      if (object["Unit"] !== "") {

        for (const key in getSubconValue) {
            // Check if the value is undefined, empty string, or NaN
            if (getSubconValue[key] === '' || getSubconValue[key] === undefined || isNaN(getSubconValue[key])) {
                getSubconValue[key] = 0.00;  // Set to 0.00 if any condition matches
            }
        }

        for (const key in matchedValues) {
            if (matchedValues[key] === '' || matchedValues[key] === undefined || isNaN(matchedValues[key])) {
              matchedValues[key] = 0.00;  // Set to 0.00 if any condition matches
          }
        }
      }

      const hasMatches = 
        (Object.keys(matchedValues).length === unittype.length) && 
        (Object.keys(getSubconValue).length === valueSubconDetails);

      if (!hasMatches) {
        this.$emit('fail-message', "Error Message: The template is outdated. Please download it again.");
        hasErrors = true;
        return;
        
      }

      matchedData.push({
        matchedValues,
        element: object["Element"],
        sub_element: object["Sub Element"],
        description_sub_sub_element: object["Sub Sub Element"],
        description_unit: object["Unit"],
        description_item: object["Description"],
        budget: getSubconValue,
      });
  });

  if (!hasErrors) {
    try {
      console.log('matchedData',matchedData);

      const successMessage = await DescriptionController.addDescription(cqId, matchedData);
      const message = successMessage[0].split(',')[0].trim(); 
      this.$emit('message', message);

      const storedProjectId = localStorage.getItem('projectId');
      await this.$router.push({
        path: '/comparison',
        query: { cqID: cqId, projectID: storedProjectId }
       });
    } catch (error) {
      
       this.$emit('fail-message', `Error Message: ` + error.errorMessage);
      
    } finally {
      this.isLoading = false;
    }
  } else {
    this.isLoading = false;
  }
}


  }
};
</script>
