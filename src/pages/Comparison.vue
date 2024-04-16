<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card style="height: 70%">
          <div class="comparison-title">
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h6>Project :</h6>
              <h3 class="titleHeader">{{ projectName }}</h3>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-16">
              <h6>Category :</h6>
              <h3 class="titleHeader">{{ callQuotation.trade_category }}</h3>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-16">
              <h6>Trade :</h6>
              <h3 class="titleHeader">{{ callQuotation.trade }}</h3>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-16">
              <h6>Location 1 :</h6>
              <h3 class="titleHeader">{{ callQuotation.trade_location1 }}</h3>
            </div>
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-16">
              <h6>Prepare :</h6>
              <h3 class="titleHeader">{{ callQuotation.updated_by }}</h3>
            </div>
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-16">
              <h6>Date :</h6>
              <h3 class="titleHeader">{{ callQuotation.awading_target_date }}</h3>
            </div>
          </div>
        </md-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card style="height: 97%">
          <md-card-content>
            <comparison-table></comparison-table>
          </md-card-content>
        </md-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <div class="comparison-title">
              <h4 class="titleHeader">
                <md-icon class="doneAll">done_all</md-icon> It is Ready to
                Submit Approval Quotation ?
              </h4>
              <div class="save-btn"></div>
              <SubmitModal
                :is-visible="showModal"
                @close-modal="closeModal"
              ></SubmitModal>
            </div>
          </md-card-content>
        </md-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-40"
      >
        <md-card style="background-color: #fef4e4">
          <md-card-content>
            <total-table></total-table>
            <button
              type="submit"
              class="btn-save"
              style="margin-bottom: 10px; margin-top: -20px"
            >
              Updated
            </button>
          </md-card-content>
        </md-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-60"
      >
        <md-card>
          <md-card style="width: 92%; margin-left: 39px">
            <md-card-content>
              <div class="btnList">
                <button type="submit" class="btn-approval">Approval</button>
                <button type="submit" class="btn-rejected">Rejected</button>
              </div>
            </md-card-content>
          </md-card>
          <md-card-content>
            <approval-table></approval-table>
            <button
              type="submit"
              class="btn-save"
              style="margin-bottom: 10px; margin-top: -20px"
            >
              Updated
            </button>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ComparisonTable, ApprovalTable, TotalTable } from "@/components";
import SubmitModal from "@/components/Modal/SubmitModal.vue";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";

import { Error } from "@/services";

export default {
  components: {
    ApprovalTable,
    ComparisonTable,
    TotalTable,
    SubmitModal,
  },
  data() {
    return {
      showModal: false,
      cqID: null,
      callQuotation: {},
      errorMessage: "",
      projectName: "",
    };
  },
  mounted() {
    const projectName = localStorage.getItem('projectName');
    if (projectName) {
      this.projectName = projectName;
    } else {
      console.error('Project ID not found in localStorage');
    };
    const Id = this.$route.query.cqID;
    this.getDetailCQ(Id);
  },
  methods: {
    async getDetailCQ(Id) {
      try {
        const processedData = await CallofQuotationController.getDetailCQ(Id);
        this.callQuotation = processedData[0];
        if (processedData && processedData.data) {
          for (let i = 0; i < processedData.length; i++) {
            if (processedData[i]) {
              this.callQuotation = processedData[i];
              await this.getProject(this.callQuotation.project_id);
              break;
            }
          }
        } else {
          this.errorMessage = "An error occurred while fetching projects.";
        }
      } catch (error) {
        if (error.errorMessage === undefined) {
          this.errorMessage = "Error fetching data: " + Error.getMessage(504);
        } else {
          this.errorMessage = "Error fetching data: " + error.errorMessage;
        }
      }
    },
    closeModal() {
      this.showModal = false; // Update showModal to false when modal is closed
    },
  },
};
</script>

<style>
.comparison-title {
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  display: flex;
  padding: 16px;
}

.md-layout-item {
  padding: 0 8px; /* Adjust spacing between items */
}

.titleHeader {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.row {
  display: flex;
  align-items: center;
  margin-top: -12px;
}
.row h6 {
  margin-right: 10px; /* Adjust spacing between elements */
}

.doneAll {
  color: orange !important;
}

.btnList {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-content: center;
}

.btnList button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 70px;
  margin-right: 50px;
}

.btn-rejected {
  background-color: #ff6347; /* Tomato */
  color: white;
}

.btn-approval {
  background-color: #32cd32; /* Lime Green */
  color: white;
}
</style>
