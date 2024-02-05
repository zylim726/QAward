<template>
    <div class="content">
      <div class="md-layout">
        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
          <div class="row">
              <h6>Project Site :</h6>
              <h3 class="titleHeader">AR496</h3><br>
          </div>
        </div>
        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-75">
          <div class="row">
            <h6>SSE :</h6>
              <h3 class="titleHeader" style="margin-left: 56px;">Waterproofing</h3>
          </div>
        </div>
        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
          <div class="row">
              <h6>Budget :</h6>
              <h3 class="titleHeader" style="margin-left: 30px;margin-top: 11px;">RM100,000.00</h3>
          </div>
        </div>
        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-75">
          <div class="row">
              <h6>Category :</h6>
              <h3 class="titleHeader" style="margin-left: 19px;">TS</h3>
          </div>
        </div>
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
        >
          <md-card style="height: 97%;">
            <md-card-content >
              <comparison-table></comparison-table>
            </md-card-content>
          </md-card>
        </div>
  
        <div  class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-55">
          <md-card >
            <md-card-content style="height:290px">
              <approval-table></approval-table>
            </md-card-content>
          </md-card>
        </div>

        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-45">
          <md-card>
            <md-card-content>
              <div class="table-container">
                <table class="finalTable">
                  <thead>
                    <tr>
                      <th colspan="3" class="table-heading">For AA internal: (1th Wetwork)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="description">Total Amount (BQ Qty) (RM):</td>
                      <td class="value">0.00</td>
                      <td class="value">331,152.19</td>
                    </tr>
                    <tr>
                      <td class="description">Total Saving for Qty (BQ adjusted) (RM):</td>
                      <td class="value">0.00</td>
                      <td class="value">33,152.19</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ComparisonTable, ApprovalTable } from "@/presentation/components";
  
  export default {
    components: {
      ApprovalTable,
      ComparisonTable,
    },
  };
  </script>
  
  <style>
.row {
  display: flex;
  align-items: center;
  margin-top: -12px;
}
.row h6 {
  margin-right: 10px; /* Adjust spacing between elements */
}
.finalTable {
  width: 100%;
  border-collapse: collapse;
}

.finalTable th, .finalTable td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.finalTable th {
  background-color: #f2f2f2;
  font-size: 18px;
  color: #333;
}

.finalTable .table-heading {
  font-weight: bold;
  font-size: 20px;
}

.finalTable .description {
  font-size: 16px;
  font-weight: bold;
}

.finalTable .value {
  font-size: 16px;
  color: #007bff;
}

.table-container {
  overflow-x: auto;
}

</style>