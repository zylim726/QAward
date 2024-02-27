<template>
  <div>
    <div class="container">
      <!-- Search bar -->
      <div class="search-container">
          <form class="Searchbar">
              <input type="text" v-model="searchQuery" placeholder="Search Description....." />
          </form>
      </div>

      <!-- Filter -->
      <div class="filter-container">
        <button type='button' class="transparentButton" style="margin-right: 10px;" @click="addNewColumn">
        <md-icon style="margin:6px;color: orange; font-size: 28px !important;">add_circle_outline</md-icon></button>
          
        <button @click="toggleFilter" class="transparentButton" style="margin-right: 10px;">
          <md-icon
              style="margin: 6px; color: orange; font-size: 28px !important; cursor: pointer;">
              {{ isHide ? 'visibility_off' : 'visibility' }}
            </md-icon>
        </button>
        <button type='button' class="transparentButton" style="margin-right: 10px;" @click="addNewColumn">
        <md-icon style="margin:6px;color: orange; font-size: 28px !important;">publish</md-icon></button>
        <button type='button' class="transparentButton" style="margin-right: 10px;" @click="addNewColumn">
        <md-icon style="margin:6px;color: orange; font-size: 28px !important;">system_update_alt</md-icon></button>
        <!-- <button @click="exportToCsv">Export to Excel</button> -->
      
      </div>
    </div>
    <div class="table-container" >
    <table class="comparison-table" >

      <thead>
        <tr>
          <th colspan="8"></th>
          <th colspan="15" v-if="!isHide"></th>
          <th colspan="2">AA Cost</th>
          <th colspan="3">AA Remeasurement</th>
          <th  v-if="showDynamicColumnsHeader && dynamicColumns.length > 0" :colspan="dynamicColumns.length">{{ dynamicColumnsTitle }}</th>
        </tr>
      </thead>
      <thead class="title-table">
        <tr>
          <td></td>
          <td>Category</td>
          <td>SSE</td>
          <td>Item</td>
          <td style="text-align:left;">Description</td>
          <td>Unit</td>
          <td v-if="!isHide">TypeA1</td>
          <td v-if="!isHide">TypeE1</td>
          <td v-if="!isHide">TypeC1</td>
          <td v-if="!isHide">TNB Subctation</td>
          <td v-if="!isHide">GH</td>
          <td v-if="!isHide">Infra</td>
          <td v-if="!isHide">BQ Qty</td>
          <td v-if="!isHide">ADJ Qty</td>
          <td v-if="!isHide">TypeA1</td>
          <td v-if="!isHide">TypeE1</td>
          <td v-if="!isHide">TypeC1</td>
          <td v-if="!isHide">TNB Subctation</td>
          <td v-if="!isHide">Infra</td>
          <td v-if="!isHide">BQ Qty</td>
          <td v-if="!isHide">ADJ Qty</td>
          <td> QTY</td>
          <td> Rate</td>
          <td> Amount</td>
          <td> QTY</td>
          <td> Rate</td>
          <td> Amount</td>
          <td v-for="(column, index) in dynamicColumns" :key="index">{{ column }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td  style="width: 3%;"><input type="checkbox" id="checkbox1" name="checkbox"></td>
          <td style="text-align:center;"> T3</td>
          <td style="text-align:center;">WATERPROOFING</td>
          <td style="text-align:center;">{{ item.item }}</td>
          <td style="text-align:left;">{{ item.description }}</td>
          <td style="text-align:center;">{{ item.unit }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.A1 }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.E1 }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.C1 }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.TNB }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.GH }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.infra }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.BQ }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.ADJ }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.A1 }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.E1 }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.C1 }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.TNB }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.infra }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.BQ }}</td>
          <td v-if="!isHide"  style="text-align:center;" >{{ item.ADJ }}</td>
          <td style="text-align:center;" >{{ item.QTY  }}</td>
          <td style="text-align:center;" >{{ item.rate }}</td>
          <td style="text-align:center;" >{{ item.rate }}</td>
          <td style="text-align:center;" >{{ item.rate }}</td>
          <td style="text-align:center;" >{{ item.rate }}</td>
          <td style="text-align:center;">{{ item.rate }}</td>
          <td v-for="(column, index) in dynamicColumns" :key="index">
          <input class="form-control" type="text" v-model="inputValues[index]" />
          </td>
        </tr>
      </tbody>
    </table>
    <button class="save-button">Save</button>
  </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: "ordered-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: ref(false), // Define show as a reactive ref
      searchQuery: "",
      isHide: true,
      dynamicColumns: [],
      newColumnTitle: "",
      newColumnName: "",
      items: [ 
        {
          id: 1,
          description: "Laid on concrete floors (RC Coping at Carporch & AC Ledge) ",
          unit: "m2",
          A1: "10.90",
          E1: "21.90",
          C1: "21.90",
          ADJ: "2290",
          BQ: "2543.90",
          infra: "-",
          QTY: "3941",
          rate: "0.00",
        },
        {
          id: 2,
          description: "Upturn; not exceeding 150mm high (at bathroom doors and drop at shower)",
          unit: "m2",
          A1: "10.90",
          E1: "21.90",
          C1: "21.90",
          ADJ: "2290",
          BQ: "2543.90",
          infra: "-",
          QTY: "3941",
          rate: "0.00",
        },
        {
          id: 3,
          description: "Laid on concrete floors (Water Tank) ",
          unit: "m2",
          A1: "10.90",
          E1: "21.90",
          C1: "21.90",
          ADJ: "2290",
          BQ: "2543.90",
          infra: "-",
          QTY: "3941",
          rate: "0.00",
        },
        {
          id: 4,
          description: "Upturn; not exceeding 150mm high (to sides of concrete platform at Water Tank) ",
          unit: "m2",
          A1: "10.90",
          E1: "21.90",
          C1: "21.90",
          ADJ: "2290",
          BQ: "2543.90",
          infra: "-",
          QTY: "3941",
          rate: "0.00",
        },
       ],
    };
  },
  computed: {
    filteredUsers() {
      let filteredData = this.users;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        filteredData = filteredData.filter(user =>
          user.description.toLowerCase().includes(query) ||
          user.unit.toLowerCase().includes(query) ||
          user.QTY.toLowerCase().includes(query)
        );
      }
      return filteredData;
    },
    showDynamicColumnsHeader() {
      return !this.isHide || this.dynamicColumns.length >= 1;
    },
  },
  methods: {
    toggleFilter() {
    this.isHide = !this.isHide;
    },
    addNewColumn() {
      const newColumnsInput = prompt("Enter the title and column names separated by commas (e.g., Title,Column1,Column2,Column3)");
      if (newColumnsInput) {
        // Extract title and column names from input string
        const columnsArray = newColumnsInput.split(',');
        this.dynamicColumnsTitle = columnsArray.shift().trim();
        this.dynamicColumns = columnsArray.map(column => column.trim());

        // Initialize inputValues array
        this.inputValues = new Array(this.dynamicColumns.length).fill('');

        // Set a flag to show the dynamic columns header
        this.showDynamicColumnsHeader = true;
      }
    },
    filterTable(filterValue) {
      this.isHide = !this.isHide;
    },
    exportToCsv() {
      const csvContent = this.convertToCSV(this.items); // Pass items array to convertToCSV method
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

      // Create anchor tag
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'export_data.csv');
      link.click();
    },
    convertToCSV(data) {
      const headers = Object.keys(data[0]);
      const rows = data.map(obj => headers.map(header => obj[header]));
      const headerRow = headers.join(',');
      const csvRows = [headerRow, ...rows.map(row => row.join(','))];
      return csvRows.join('\n');
    },
  },
  mounted() {
  // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[name="checkbox"]');

    // Add event listener to each checkbox
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          // Uncheck other checkboxes
          checkboxes.forEach(otherCheckbox => {
            if (otherCheckbox !== checkbox) {
              otherCheckbox.checked = false;
            }
          });
        }
      });
    });
  },
};
</script>

<style scoped>
#hide .md-table-cell[style*="display: none;"] + .md-table-head .md-table-head-container {
  display: none;
}

.container {
  margin-bottom: 20px;
}

.table-container::-webkit-scrollbar {
  height: 12px;
}

.save-button {
  bottom: 10px;
  right: 23px;
}


</style>