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
              {{ isNinja ? 'visibility_off' : 'visibility' }}
            </md-icon>
      </button>
      </div>
      <md-icon style="  margin: 7px -30px 0px 12px;color: orange; font-size: 28px !important;">refresh</md-icon>
    </div>
    <div class="table-container">
    <table class="custom-table" >
      <thead>
        <tr>
          <th colspan="8"></th>
          <th colspan="12" v-if="!isNinja"></th>
          <th colspan="2">AA Cost</th>
          <th colspan="3">AA Remeasurement</th>
          <th  v-if="showDynamicColumnsHeader" :colspan="dynamicColumns.length">{{ dynamicColumnsTitle }}</th>
        </tr>
      </thead>
      <thead class="title-table">
        <tr>
          <td></td>
          <td style="text-align:left;">Description</td>
          <td>Item</td>
          <td>Unit</td>
          <td >TypeA1</td>
          <td >TypeE1</td>
          <td >TypeC1</td>
          <td v-if="!isNinja">TNB Subctation</td>
          <td v-if="!isNinja">GH</td>
          <td v-if="!isNinja">Infra</td>
          <td v-if="!isNinja">BQ Qty</td>
          <td v-if="!isNinja">ADJ Qty</td>
          <td v-if="!isNinja">TypeA1</td>
          <td v-if="!isNinja">TypeE1</td>
          <td v-if="!isNinja">TypeC1</td>
          <td v-if="!isNinja">TNB Subctation</td>
          <td v-if="!isNinja">Infra</td>
          <td v-if="!isNinja">BQ Qty</td>
          <td v-if="!isNinja">ADJ Qty</td>
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
          <td style="text-align:left;">{{ item.description }}</td>
          <td style="text-align:center;">{{ item.item }}</td>
          <td style="text-align:center;">{{ item.unit }}</td>
          <td style="text-align:center;" >{{ item.A1 }}</td>
          <td style="text-align:center;" >{{ item.E1 }}</td>
          <td style="text-align:center;" >{{ item.C1 }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.TNB }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.GH }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.infra }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.BQ }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.ADJ }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.A1 }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.E1 }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.C1 }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.TNB }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.infra }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.BQ }}</td>
          <td v-if="!isNinja"  style="text-align:center;" >{{ item.ADJ }}</td>
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
      isNinja: true,
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
          name: "Mr Lee",
          date: "2/1/2024",
          remarks: "good",
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
          name: "Mr Khew",
          date: "2/1/2024",
          remarks: "good",
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
          name: "Mr Chuah",
          date: "2/1/2024",
          remarks: "good",
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
      return !this.isNinja || this.dynamicColumns.length >= 1;
    },
  },
  methods: {
    toggleFilter() {
    this.isNinja = !this.isNinja;
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
      }
    },
    filterTable(filterValue) {
      this.isNinja = !this.isNinja;
    },
  },
  mounted() {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[name="checkbox"]');

    // Add event listener to each checkbox
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {searc
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

.table-container {
  overflow-x: auto;
}

.custom-table {
  border-collapse: collapse;
  table-layout: fixed;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-table th,
.custom-table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 13px;
  overflow: visible; /* Allow overflow for full text visibility */
  white-space: nowrap;
}

.custom-table th {
  background-color: #f2f2f2;
  font-size: 16px;
  font-weight: bold;
}

.custom-table td {
  font-size: 14px;
}

.table-container::-webkit-scrollbar {
  height: 12px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.table-container::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
}

.table-container::-webkit-scrollbar-corner {
  background-color: transparent;
}



.save-button {
  position: absolute;
  bottom: 10px;
  right: 23px;
  padding: 8px 16px;
  background-color: orange;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
}

.save-button:hover {
  background-color: orange;
}

</style>