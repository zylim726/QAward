<template>
  <div>
    <div class="container" style="margin-top: 20px">
      <!-- Search bar -->
      <div class="search-container">
        <form class="Searchbar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search Description....."
          />
        </form>
      </div>

      <!-- Filter -->
      <div class="filter-container">
        <a href="#/revision"
          ><button type="button" class="btn-save" style="margin-right: 10px">
            Revision
          </button></a
        >
        <a href="#/quotation"
          ><button type="button" class="btn-save" style="margin-right: 10px">
            Add Quotation
          </button></a
        >
        <a href="#/description"
          ><button type="button" class="btn-save" style="margin-right: 10px">
            Add Description
          </button></a
        >
    

        <button
          @click="toggleFilter"
          class="transparentButton"
          style="margin-right: 10px"
        >
          <md-icon class="mdIcon">
            {{ isHide ? "visibility_off" : "visibility" }}
          </md-icon>
        </button>
        <button
          type="button"
          class="transparentButton"
          style="margin-right: 10px"
          @click="exportToCsv"
        >
          <md-icon class="mdIcon">system_update_alt</md-icon>
        </button>
      </div>
    </div>
    <div class="table-container">
      <table class="nested-table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Element</th>
            <th scope="col">Sub Element</th>
            <th scope="col">Sub Sub Element</th>
            <th scope="col">Description</th>
            <th scope="col">Unit</th>
            <th scope="col" v-if="!isHide">Type A1</th>
            <th scope="col" v-if="!isHide">Type E1</th>
            <th scope="col" v-if="!isHide">Type C1</th>
            <th scope="col" v-if="!isHide">BQ Qty</th>
            <th scope="col" v-if="!isHide">ADJ Qty</th>
            <th scope="col">QTY</th>
            <th scope="col" colspan="2">AA Cost</th>
            <th scope="col" colspan="2">Wekwork</th>
          </tr>
          <tr>
            <th colspan="6"></th>
            <th scope="col" class="unityQuantityClass" v-if="isHide"></th>
            <th scope="col" class="unityQuantityClass" v-if="!isHide">24</th>
            <th scope="col" class="unityQuantityClass" v-if="!isHide">40</th>
            <th scope="col" class="unityQuantityClass" v-if="!isHide">38</th>
            <th scope="col" class="unityQuantityClass" v-if="!isHide"></th>
            <th scope="col" class="unityQuantityClass" v-if="!isHide"></th>
            <th scope="col" class="unityQuantityClass" v-if="!isHide"></th>
            <th scope="col">Rate</th>
            <th scope="col">Amount</th>
            <th scope="col">Rate</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Element</td>
            <td>Sub Element</td>
            <td>WATERPROOFING</td>
            <td>EXTERNAL FLOOR FINISHES</td>
            <td></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td colspan="5"></td>
          </tr>
          <tr>
            <td>1.1</td>
            <td></td>
            <td></td>
            <td></td>
            <td>Work in Connection With Waterproofing</td>
            <td></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td colspan="5"></td>
          </tr>
          <tr>
            <td><b>1.1.1</b></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <b>Laid on concrete floors (RC Coping at Carporch & AC Ledge)</b>
            </td>
            <td><b>m2</b></td>
            <td v-if="!isHide"><b>10.90</b></td>
            <td v-if="!isHide"><b>21.90</b></td>
            <td v-if="!isHide"><b>18.90</b></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td><b>24539.90</b></td>
            <td>10.00</td>
            <td>1000.00</td>
            <td>9.00</td>
            <td>900.00</td>
          </tr>
          <tr>
            <td><b>1.1.2</b></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <b>Laid on concrete floors (RC Coping at Carporch & AC Ledge)</b>
            </td>
            <td><b>m2</b></td>
            <td v-if="!isHide"><b>9.90</b></td>
            <td v-if="!isHide"><b>21.90</b></td>
            <td v-if="!isHide"><b>18.90</b></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td><b>24539.90</b></td>
            <td>10.00</td>
            <td>1000.00</td>
            <td>9.00</td>
            <td>900.00</td>
          </tr>
          <tr>
            <td><b>1.1.3</b></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <b>Laid on concrete floors (RC Coping at Carporch & AC Ledge)</b>
            </td>
            <td><b>m2</b></td>
            <td v-if="!isHide"><b>10.90</b></td>
            <td v-if="!isHide"><b>21.90</b></td>
            <td v-if="!isHide"><b>18.90</b></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td><b>24539.90</b></td>
            <td>10.00</td>
            <td>1000.00</td>
            <td>9.00</td>
            <td>900.00</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Element</td>
            <td>Sub Element</td>
            <td>WATERPROOFING</td>
            <td>EXTERNAL FLOOR FINISHES</td>
            <td></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td></td>
          </tr>
          <tr>
            <td>2.1</td>
            <td></td>
            <td></td>
            <td></td>
            <td>Work in Connection With Waterproofing</td>
            <td></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td></td>
          </tr>
          <tr>
            <td><b>2.1.1</b></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <b>Laid on concrete floors (RC Coping at Carporch & AC Ledge)</b>
            </td>
            <td><b>m2</b></td>
            <td v-if="!isHide"><b>10.90</b></td>
            <td v-if="!isHide"><b>21.90</b></td>
            <td v-if="!isHide"><b>18.90</b></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td><b>24539.90</b></td>
            <td>10.00</td>
            <td>1000.00</td>
            <td>9.00</td>
            <td>900.00</td>
          </tr>
          <tr>
            <td>2.2</td>
            <td></td>
            <td></td>
            <td></td>
            <td>Work in Connection With Waterproofing</td>
            <td></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td></td>
          </tr>
          <tr>
            <td><b>2.2.1</b></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <b>Laid on concrete floors (RC Coping at Carporch & AC Ledge)</b>
            </td>
            <td><b>m2</b></td>
            <td v-if="!isHide"><b>10.90</b></td>
            <td v-if="!isHide"><b>21.90</b></td>
            <td v-if="!isHide"><b>18.90</b></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td><b>24539.90</b></td>
            <td>10.00</td>
            <td>1000.00</td>
            <td>9.00</td>
            <td>900.00</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Element</td>
            <td>Sub Element</td>
            <td>WATERPROOFING</td>
            <td>EXTERNAL FLOOR FINISHES</td>
            <td></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td></td>
          </tr>
          <tr>
            <td>4</td>
            <td>Element</td>
            <td>Sub Element</td>
            <td>WATERPROOFING</td>
            <td>EXTERNAL FLOOR FINISHES</td>
            <td></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td></td>
          </tr>
          <tr>
            <td><b>4.1.1</b></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <b>Laid on concrete floors (RC Coping at Carporch & AC Ledge)</b>
            </td>
            <td><b>m2</b></td>
            <td v-if="!isHide"><b>10.90</b></td>
            <td v-if="!isHide"><b>21.90</b></td>
            <td v-if="!isHide"><b>18.90</b></td>
            <td v-if="!isHide"></td>
            <td v-if="!isHide"></td>
            <td><b>24539.90</b></td>
            <td>10.00</td>
            <td>1000.00</td>
            <td>9.00</td>
            <td>900.00</td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

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
      items: [
        {
          id: 1,
          description:
            "Laid on concrete floors (RC Coping at Carporch & AC Ledge) ",
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
          description:
            "Upturn; not exceeding 150mm high (at bathroom doors and drop at shower)",
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
          description:
            "Upturn; not exceeding 150mm high (to sides of concrete platform at Water Tank) ",
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
        filteredData = filteredData.filter(
          (user) =>
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
    filterTable(filterValue) {
      this.isHide = !this.isHide;
    },
    exportToCsv() {
      const csvContent = this.convertToCSV(this.items); // Pass items array to convertToCSV method
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

      // Create anchor tag
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "export_data.csv");
      link.click();
    },
    convertToCSV(data) {
      const headers = Object.keys(data[0]);
      const rows = data.map((obj) => headers.map((header) => obj[header]));
      const headerRow = headers.join(",");
      const csvRows = [headerRow, ...rows.map((row) => row.join(","))];
      return csvRows.join("\n");
    },
  },
  mounted() {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[name="checkbox"]');

    // Add event listener to each checkbox
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          // Uncheck other checkboxes
          checkboxes.forEach((otherCheckbox) => {
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
.table-container {
  overflow-x: auto;
  white-space: nowrap;
}

.addQuotationBtn {
  color: white;
  font-size: 10px;
  cursor: pointer;
  background-color: orange;
  border: none;
  height: 20px;
}
/* Style the container */
.container {
  margin-top: 20px;
}

/* Style the search bar */
.search-container {
  margin-bottom: 10px;
}

.Searchbar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Style the filter buttons */
.filter-container {
  margin-bottom: 10px;
}

.transparentButton {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.mdIcon {
  vertical-align: middle;
}

/* Table styles */
.nested-table {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ddd;
  padding: 10px;
}
.nested-table th,
.nested-table td {
  border: none;
  padding: 5px;
  text-align: left;
}
.nested-table th {
  background-color: #fef4e4;
  border: none;
}

.unityQuantityClass {
  text-align: center !important;
}
</style>
