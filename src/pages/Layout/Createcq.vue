<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success" style="margin-left: 15px;">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail" style="margin-left: 15px;">{{ FailMessage }} <md-icon>cancel</md-icon></div>

    <div class="step-buttons">
      <button class="step-button" @click="activeStep = 1" :class="{ active: activeStep === 1 }">Step 1 : Create / Import Comparison Summary</button>
      <button class="step-button" @click="activeStep = 2" :class="{ active: activeStep === 2 }">Step 2 : Map Unit Type</button>
    </div>
    <div class="md-layout" v-show="activeStep === 1">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-25"
        style="padding: 0px 17px"
      >
        <md-card>
          <Createcq-table @form-submitted="cqformSubmit" ></Createcq-table>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-75"
      >
        <md-card>
          <md-card-content>
            <CQ-import :formDataList="formDataList" @message="ImportMessage"  @fail-message="ImportErrorMessage" @remove-item="removeItem"></CQ-import>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div class="md-layout" v-show="activeStep === 2">
      <md-card>
        <getcallquotation-table  @message="ImportMessage"  @fail-message="ImportErrorMessage"></getcallquotation-table>
      </md-card>
    </div>
  </div> 
</template>

<script>
import {
  CQImport,
  CreatecqTable,
  GetcallquotationTable
} from "@/components";

export default {
  components: {
    CQImport,
    CreatecqTable,
    GetcallquotationTable,
  },
  data() {
    return {
      formDataList: [],
      UpdateMessage: null,
      FailMessage: null,
      activeStep: 1, 
    };
  },
  methods: {
    cqformSubmit(formDataUnit) {
      this.formDataList.push(formDataUnit);
    },
    ImportMessage(message) {
      if (!this.UpdateMessage) {
        this.UpdateMessage = message;
        setTimeout(() => {
          this.UpdateMessage = '';
        }, 2000);
      }
    },
    ImportErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.FailMessage = '';
      }, 2000);
    },
    removeItem(index) {
      this.formDataList.splice(index, 1);
    },
  }
};
</script>
