<template>
  <div>
    <div class="table-container">
      <table class="styled-table">
        <thead class="table-light">
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Element</th>
            <th scope="col">Sub Element</th>
            <th scope="col">Sub Sub Element</th>
            <th scope="col">Description 1</th>
            <th scope="col">Description 2</th>
            <th scope="col">
              Description 3<span style="color: red">***</span>
            </th>
            <th scope="col">Unit</th>
            <th scope="col">Type A1</th>
            <th scope="col">Type E1</th>
            <th scope="col">Type C1</th>
            <th scope="col">TNB Substation</th>
            <th scope="col">BQ Qty</th>
            <th scope="col">ADJ Qty</th>
            <th scope="col">QTY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="col" colspan="8"></th>
            <th>24</th>
            <th>40</th>
            <th>38</th>
            <th>50</th>
            <th scope="col" colspan="3"></th>
          </tr>
          <tr>
            <td>Item</td>
            <td>Element</td>
            <td>Sub Element</td>
            <td>Sub Sub Element</td>
            <td>Description 1</td>
            <td>Description 2</td>
            <td>Description 3</td>
            <td>Unit</td>
            <td>Type A1</td>
            <td>Type E1</td>
            <td>Type C1</td>
            <td>TNB Substation</td>
            <td>BQ Qty</td>
            <td>ADJ Qty</td>
            <td>QTY</td>
          </tr>
        </tbody>
      </table>
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
