<template>
  <div class="content">
    <div v-if="isLoading" class="spinner-border" role="status">
      <span class="visually-hidden">
        <button class="transparentButton" style="margin-right: 10px; cursor: default;">
          <md-icon style="color: red; margin-bottom:10px;">autorenew</md-icon>
        </button> Loading...
      </span>
    </div>
    <div v-if="UpdateMessage" class="notification success">
      {{ UpdateMessage }} 
      <md-icon style="color:green">check_circle_outline</md-icon>
    </div>
    <div v-if="FailMessage" class="notification fail">
      {{ FailMessage }} 
      <md-icon>cancel</md-icon>
    </div>
    <br>
    <div class="md-layout">
      <div v-if="!isLoading" class="row" style="margin-left: 16px">
        <h6>Project Name :</h6>
        <h3 class="titleHeader">{{ projectName }}</h3>
        <br>
      </div>

      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <div class="flex-container">
          <!-- Left Side: Summary Cards -->
          <div class="summary-container">
            <md-card class="summary-item">
              <md-card-content class="summary-card" style="border-right: 2px solid blue;">
                <div class="card-header">
                  <p>Provisional Sum</p>
                  <div class="icon-circle" style="background-color: #F1F7FF;">
                    <md-icon style="color: blue;">signal_cellular_alt</md-icon>
                  </div>
                </div>
                <div class="card-content">
                  <h2>{{ formatAccounting(lawoComparison.provisional_sum) }}</h2>
                </div>
              </md-card-content>
            </md-card>

            <md-card class="summary-item">
              <md-card-content class="summary-card" style="border-right: 2px solid red;">
                <div class="card-header">
                  <p>Contact Sum</p>
                  <div class="icon-circle" style="background-color: #FFF1F1;">
                    <md-icon style="color: red;">query_stats</md-icon>
                  </div>
                </div>
                <div class="card-content">
                  <h2>{{ formatAccounting(lawoComparison.contract_sum) }}</h2>
                </div>
              </md-card-content>
            </md-card>

            <md-card class="summary-item">
              <md-card-content class="summary-card" style="border-right: 2px solid green;">
                <div class="card-header">
                  <p>Retention</p>
                  <div class="icon-circle" style="background-color: #F1FFF6;">
                    <md-icon style="color: green;">area_chart</md-icon>
                  </div>
                </div>
                <div class="card-content">
                  <h2>{{ formatAccounting(lawoComparison.retention) }}</h2>
                </div>
              </md-card-content>
            </md-card>

            <md-card class="summary-item">
              <md-card-content class="summary-card" style="border-right: 2px solid orange;">
                <div class="card-header">
                  <p>Skilled Worker Rate</p>
                  <div class="icon-circle" style="background-color: #FEF5E8;">
                    <md-icon style="color: orange;">ssid_chart</md-icon>
                  </div>
                </div>
                <div class="card-content">
                  <h2>{{ formatAccounting(lawoComparison.skilled_worker_rate) }}</h2>
                </div>
              </md-card-content>
            </md-card>
          </div>

          <!-- Right Side: Detailed Information -->
          <div class="right-side" style="width: 100% !important;">
            <md-card class="comparison-card">
              <md-card-content>
                <div class="comparison-item">
                  <span class="label">Code:</span>
                  <span class="value">{{ lawoComparison.code }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">Subcon Name:</span>
                  <span class="value">{{ lawoComparison.subconName }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">Trade:</span>
                  <span class="value">{{ lawoComparison.trade }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">Category:</span>
                  <span class="value">{{ lawoComparison.category }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">Sub Element:</span>
                  <span class="value">{{ lawoComparison.sub_element }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">Sub Sub Element:</span>
                  <span class="value">{{ lawoComparison.sub_sub_element }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">Created By:</span>
                  <span class="value">{{ lawoComparison.updateBy }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">Date:</span>
                  <span class="value">{{ formatDate(lawoComparison.updateDate) }}</span>
                </div>
                <div class="comparison-item">
                  <span class="label">Remarks:</span>
                  <span class="value">{{ lawoComparison.remarks }}</span>
                </div>
              </md-card-content>
            </md-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
const XLSX = require('xlsx');
import { ref } from "vue";
import LaController from "@/services/controllers/LaController.js";

export default {
  components: {
  
  },
  data() {
    return {
      show: ref(false),
      lawoComparison: [],
      UpdateMessage: null,
      FailMessage: null,
      isLoading: false,
      projectName: "",
    };
  },
  mounted() {
    const projectName = localStorage.getItem('projectName');
    if (projectName) {
      this.projectName = projectName;
    } else {
      this.FailMessage = "Project ID not found in localStorage";
    };
    this.accessCQApprove();
  },
  methods: {
    formatAccounting(value) {
      if (!value) {
        return '0.00';
      }
      return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    async accessCQApprove() {
      try {
        this.isLoading = true;
        const queryParams = this.$route.query;
        if (queryParams.woCqId) {
          const processedData = await LaController.accessWO(queryParams.woCqId);
          if (Array.isArray(processedData) && processedData.length > 0) {
            this.lawoComparison = processedData[0];
            console.log('this lawoComparison', this.lawoComparison);
          } else {
            this.FailMessage = "No data.";
          }
        } else if (queryParams.laCqId) {
          const processedData = await LaController.accessLa(queryParams.laCqId);
          if (Array.isArray(processedData) && processedData.length > 0) {
            this.lawoComparison = processedData[0];
            console.log('this lawoComparison', this.lawoComparison);
          } else {
            this.FailMessage = "No data.";
          }
        } else {
          this.FailMessage = "Error Message : No valid query parameter.";
        }
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || 'Unknown error'}`;
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(dateTimeString) {
      if (!dateTimeString) return '';

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return ''; 
      }

      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }


  },
};
</script>


<style scoped>
.flex-container {
  display: flex;
  gap: 20px; 
}

.summary-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
  width: 100%; 
}

.summary-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comparison-card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.comparison-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}


</style>
