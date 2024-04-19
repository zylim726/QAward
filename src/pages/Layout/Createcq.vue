<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success" style="margin-left: 15px;">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail" style="margin-left: 15px;">{{ FailMessage }} <md-icon>cancel</md-icon></div>

    <div class="step-buttons">
      <button class="step-button" @click="activeStep = 1" :class="{ active: activeStep === 1 }">Step 1 : Create / Import Call for Quotation</button>
      <button class="step-button" @click="activeStep = 2" :class="{ active: activeStep === 2 }">Step 2 : Create / Import Unit Type</button>
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
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-25"
        style="padding: 0px 17px"
      >
        <md-card>
          <unittype-table @form-unit="unitformSubmit" ></unittype-table>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-75"
      >
        <md-card>
          <unittype-import
            :formDataUnitList="formDataUnitList"  
            @save-data="UnitSaveData"
          ></unittype-import>
        </md-card>
      </div>
      <div v-if="hasDataToShow" class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="padding: 0px 17px">
      <div class="notification warning">Please Select the Call for Quotation <md-icon style="color:orange">error_outline</md-icon></div>
      <md-card>
        <getcallquotation-table :Unittype="Unittype" @message="ImportMessage"  @fail-message="ImportErrorMessage"></getcallquotation-table>
      </md-card>
    </div>
    </div>
  </div>
</template>

<script>
import {
  CQImport,
  CreatecqTable,
  UnittypeTable,
  UnittypeImport,
  GetcallquotationTable
} from "@/components";

export default {
  components: {
    CQImport,
    CreatecqTable,
    UnittypeTable,
    UnittypeImport,
    GetcallquotationTable,
  },
  data() {
    return {
      formDataList: [],
      UpdateMessage: null,
      FailMessage: null,
      activeStep: 1, 
      hasDataToShow: false,
      Unittype:[],
      formDataUnitList:[],
    };
  },
  methods: {
    cqformSubmit(formDataUnit) {
      this.formDataList.push(formDataUnit);
    },
    unitformSubmit(formDataUnit) {
      this.formDataUnitList.push(formDataUnit);
      console.log('this.formDa',this.formDataUnitList)
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
    UnitSaveData(data) {
      this.Unittype.push(data);
      if (this.Unittype.length > 0) {
        this.hasDataToShow = true;
      } else {
        this.hasDataToShow = false;
      }
    }
  }
};
</script>

<style>
.step-buttons {
  display: flex;
  margin-left: 16px;
  margin-top: 5px;
}

.step-button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}

.step-button.active {
  background-color: orange;
  color: #fff;
}
</style>
