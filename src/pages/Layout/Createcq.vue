<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <label class="titleHeader"
      >Step 1 : Create / Import Call of Quotation</label
    >
    <div class="md-layout">
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
            <CQ-import :formDataList="formDataList" @data-saved="CQImportData"></CQ-import>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <br />
    <label class="titleHeader">Step 2 : Create / Import Unit Type </label>
    <div class="md-layout">
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
          <unittype-import :formDataUnitList="formDataUnitList"></unittype-import>
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
} from "@/components";

export default {
  components: {
    CQImport,
    CreatecqTable,
    UnittypeTable,
    UnittypeImport,
  },
  data() {
    return {
      formDataList: [],
      formDataUnitList: [],
      UpdateMessage: null,
      FailMessage: null,
      selectedFormDataList: [],
      selectedImportedData: [],
    };
  },
  methods: {
    cqformSubmit(formDataUnit) {
      this.formDataList.push(formDataUnit);
    },
    unitformSubmit(formDataUnit) {
      this.formDataUnitList.push(formDataUnit);
    },
    CQImportData(data) {
      this.selectedFormDataList = data.selectedFormDataList;
      this.selectedImportedData = data.selectedImportedData;
      console.log('Selected Data:', this.selectedFormDataList);
      console.log('Selected Imported Data:', this.selectedImportedData);
    },
    ImportMessage(message) {
      this.UpdateMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 1000);
    },
    ImportErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.FailMessage = '';
      }, 1000);
    },
  }
};
</script>
