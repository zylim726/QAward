<template>
  <div class="confirmation-message"  style="width: fit-content; justify-content: left !important;">
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <p>Work Order</p>
    <label class="wo_switchon">
      <input type="checkbox" v-model="isSwitchOn" @change="handleCheckboxChange" :disabled="!hasAccess || projectData[0].status !== 'Pending'" />
      <span class="wo_slider"></span>
    </label>
    <span>{{ isSwitchOn ? 'Yes' : 'No' }}</span>
  </div>
</template>

<script>
import DescriptionController from '@/services/controllers/DescriptionController.js';
import CallofQuotationController from '@/services/controllers/CallofQuotationController.js';
import { checkAccess } from '@/services/axios/accessControl.js';
import QuotationController from '@/services/controllers/QuotationController.js';

export default {
  props: {
    cqId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      Unittype: [],
      projectData: [],
      hasAccess: false,
      isSwitchOn: false, 
      FailMessage: null, 
    };
  },
  watch: {
    cqId(newValue) {
      this.getDescription(newValue);
      this.getProject(newValue);
      this.checkPermission();
    },
  },
  computed: {
    isPermissionChecked() {
      if (this.Unittype.length > 0 && this.Unittype[0].Cq_Unit_Type?.Call_For_Quotation) {
        return this.Unittype[0].Cq_Unit_Type.Call_For_Quotation.is_work_order === true;
      }
      return false;
    },
  },
  methods: {
    async checkPermission() {
      try {
        const permission = await checkAccess();
        console.log('permission',permission);
        const accessIds = ['Submit Work Order'];
        this.hasAccess = accessIds.some((id) => permission.includes(id));
        console.log('this hassAccess',this.hasAccess);
      } catch (error) {
        this.FailMessage = `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
      }
    },
    async getDescription(id) {
      try {
        this.isLoading = true;
        let processedData = await DescriptionController.getNewDescription(id);

        if (!Array.isArray(processedData)) {
          processedData = [];
        }
        this.Unittype = processedData.length > 0 ? processedData[0].cqUnitType : [];

        // Update switch state based on the value of is_work_order
        this.isSwitchOn = this.isPermissionChecked; // Initialize isSwitchOn based on computed property
      } catch (error) {
        this.FailMessage = `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
      } finally {
        this.isLoading = false;
      }
    },
    async getProject(id) {
      try {
        this.projectData = await CallofQuotationController.getDetailCQ(id);
      } catch (error) {
        this.FailMessage = `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
      }
    },
    async handleCheckboxChange() {
      try {
        const successMessage = await QuotationController.updateWorkOrder(this.isSwitchOn, this.cqId);
        console.log('Success updating Work Order:', successMessage);
      } catch (error) {
        this.FailMessage = `Error updating Work Order: ${error.errorMessage || 'Unknown Data.'}`;
        console.error(this.FailMessage);
      }
    },
  },
};
</script>
