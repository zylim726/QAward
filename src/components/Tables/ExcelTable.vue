<template>
    <div>
      <input type="file" @change="handleFileUpload">
      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th v-for="(value, key) in csvData[0]" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in csvData" :key="index">
              <td v-for="(value, key) in row" :key="key">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import Import from 'papaparse';
  
  export default {
    data() {
      return {
        csvData: [
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
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        Import.parse(file, {
          complete: (result) => {
            // result.data contains the parsed Excel data as an array of objects
            this.csvData.push(...result.data); // Append new data to existing data
          },
          header: true, // Treat the first row as header
        });
      },
    },
  };
  </script>
  
  <style>
  .table-container {
    overflow-x: auto;
  }
  
  .custom-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .custom-table th,
  .custom-table td {
    border: 1px solid #dddddd;
    padding: 12px;
    text-align: left;
  }
  
  .custom-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  </style>
  