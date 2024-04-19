



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
        <a href="revision"
          ><button type="button" class="btn-save" style="margin-right: 10px">
            Revision
          </button></a
        >
        <a href="quotation"
          ><button type="button" class="btn-save" style="margin-right: 10px">
            Add Quotation
          </button></a
        >
        <a href="description"
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
          <template v-if="!isHide">
              <th scope="col"  v-for="(unitdata, index) in Unittype" :key="index">{{ unitdata.name }}</th>
          </template>
          <th scope="col">QTY</th>
          <th scope="col" colspan="2" style="text-align: center;">AA Cost</th>
          <th scope="col" colspan="2" style="text-align: center;">Wekwork</th>
        </tr>
        <tr>
          <th colspan="6"></th>
          <template v-if="!isHide">
              <th scope="col"  v-for="(unitdata, index) in Unittype" :key="index" style="text-align: center;">{{ unitdata.quantity }}</th>
          </template>
          <th scope="col"></th>
          <th scope="col">Rate</th>
          <th scope="col">Amount</th>
          <th scope="col">Rate</th>
          <th scope="col">Amount</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <br />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";

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
      show: ref(false), 
      searchQuery: "",
      isHide: true,
      Unittype: [
      { name: 'Type A1', quantity: '10' },
      { name: 'Type E1', quantity: '10' },
      { name: 'Type C1', quantity: '10' },
      ],
      items: [],
    };
  },
  // created() {
  //   this.getUnittype();
  // },
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
    // async getUnittype() {
    //   try {
    //     const response = await CallofQuotationController.getUnittype();
    //     this.Unittype = response.data; 
    //   } catch (error) {
    //     console.error('Error fetching Unittype:', error);
    //   }
    // }
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
