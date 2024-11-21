<template>
  <div class="content">
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content" style="max-height: 550px;">
        <h1 class="titleHeader">Select Unit Type</h1><br>
        <table class="project-table">
              <thead>
                <tr>
                  <th scope="col">
                  </th>
                  <th scope="col">Unit Type</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">ADJ Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="UnitTypes.length === 0">
                  <td colspan="4" class="no-data" style="text-align: center;" >No Unit Types available. Please set up Unit Types in the Project Setup</td>
                </tr>
                <tr v-for="(formData, index) in UnitTypes" :key="'unit_' + index" :class="{ 'selected-row': formData.selected }">
                  <td><input type="checkbox" v-model="formData.selected"></td>
                  <td>{{ formData.unit_type }}</td>
                  <td>{{ formData.quantity }}</td>
                  <td>{{ formData.adj_factor }}</td>
                </tr>
              </tbody>
            </table>
        <button class="btn-confirm" style="margin-left: 89%;margin-top: 18px;"  @click="confirmSubconSelection">Submit</button>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="margin-top: -65px;">
        <div v-if="UpdateMessage" class="notification success" style="margin-top: 65px;">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
        <div v-if="FailMessage" class="notification fail" style="margin-top: 65px;">{{ FailMessage }} <md-icon>cancel</md-icon></div>
        <br>
        <md-card style="height: 65%">
          <div class="status">
            <i class="material-icons" style="margin-top: 9px;">notifications_active</i>
            <h7>Status : <b class="titleHeader">{{ callQuotation.status }}</b></h7>
          </div>
          <div class="comparison-title">
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h7>Project :</h7>
              <h5 class="titleHeader">{{ callQuotation.project_code }}</h5>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h7>Category :</h7>
              <h5 class="titleHeader">{{ callQuotation.trade_category ? callQuotation.trade_category : '-' }}</h5>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h7>Trade :</h7>
              <h5 class="titleHeader">{{ callQuotation.trade ? callQuotation.trade : '-' }}</h5>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h7>Location 1 :</h7>
              <h5 class="titleHeader">{{ callQuotation.trade_location1 ? callQuotation.trade_location1 : '-' }}</h5>
            </div>
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h7>Prepare :</h7>
              <h5 class="titleHeader">{{ callQuotation.created_by }}</h5>
            </div>
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-11">
              <h7>Awarding Target Data :</h7>
              <h5 class="titleHeader">{{ formatDate(callQuotation.awarding_target_date) ? formatDate(callQuotation.awarding_target_date) : '-' }}</h5>
            </div>
            <button class="transparentButton"  @click="editCallQuotation(callQuotation.id)" >
            <div class="tooltip">
              <span class="tooltiptext">Edit Comparison Summary</span>
              <md-icon style="color: orange;">edit_square</md-icon></div>
            </button>
            <br>
            <button class="transparentButton" @click="deleteCallQuotation(callQuotation.id)" >
            <div class="tooltip" v-if="callQuotation && callQuotation.status !== 'Waiting Approval' &&  callQuotation.status !== 'Approved' "  >
              <span class="tooltiptext">Delete Comparison Summary</span>
              <md-icon style="color: orange;">delete</md-icon></div>
            </button>
            <a :href="'revision?cqId=' + callQuotation.id" class="transparentButton">
              <div class="tooltip">
                <span class="tooltiptext">Comparison Revision List</span>
                <md-icon style="color: orange;">library_books</md-icon>
              </div>
          </a>
          </div>
        </md-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="margin-top: -40px;">
        <md-card style="min-height: 97%">
          <md-card-content style="line-height: 16px !important;">
            <workorder-table :cqId="cqId" ></workorder-table>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" style="margin-top: -40px;">
        <md-card style="min-height: 97%">
          <md-card-content style="line-height: 16px !important;">
            <comparison-table :cqId="cqId" ></comparison-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <EditCQ :edit-modal="editModal" @editMessage="EditMessage" @editfail-message="EditErrorMessage" @close="closeEditModal" :id="editId"  title="Edit Comparison Summary"></EditCQ>
    <DeleteCQ :show-modal="showModal" @message="ModalMessage" @fail-message="ModalErrorMessage" @close="closeModal" :id="deleteId" title="Delete Comparison Summary"></DeleteCQ>
  </div>
</template>

<script>
import { ComparisonTable, WorkorderTable } from "@/components";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";
import { EditCQ,DeleteCQ }  from "@/components";

export default {
  components: {
    ComparisonTable,
    WorkorderTable,
    EditCQ,
    DeleteCQ,
  },
  data() {
    return {
      showModal: false,
      callQuotation: {},
      projectName: "",
      cqId: 0,
      isModalVisible: false,
      CQunitType:[],
      UnitTypes: [],
      UpdateMessage: null,
      FailMessage: null,
      editModal: false,
      deleteId: null,
      editId: null,
      editUTId: null,
    };
  },
  mounted() {
    const Id = this.$route.query.cqID;
    this.cqId = Id;
    this.getDetailCQ(this.cqId);
    this.getCQUnitType(this.cqId);
    this.getUTypes(); 
  },
  methods: {
    editCallQuotation(id) {
      this.editId = id;
      this.editModal = true;
    },
    closeEditModal() {
      this.editModal = false;
    },
    deleteCallQuotation(id) {
      this.deleteId = id;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    ModalMessage(message) {
      this.UpdateMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 1000);
    },
    ModalErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 1000);
    },
    EditMessage(message) {
      this.UpdateMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    EditErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    formatDate(dateTimeString) {
      if (!dateTimeString) return '';

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return ''; // Return empty string for invalid dates
      }

      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }
    ,
    async getDetailCQ(Id) {
      try {
        const processedData = await CallofQuotationController.getDetailCQ(Id);
       
        this.callQuotation = processedData[0];
        const projectId = this.callQuotation.project_id;
        const projectName = this.callQuotation.project_code;
        localStorage.setItem('projectName', projectName);
        localStorage.setItem('projectId', projectId);
    
        if (processedData && processedData.data) {
          for (let i = 0; i < processedData.length; i++) {
            if (processedData[i]) {
              this.callQuotation = processedData[i]; 
              await this.getProject(this.callQuotation.project_id);
              break;
            }
          }
        } 
      } catch (error) {
        this.FailMessage = `${error.errorMessage || 'Unknown error'}`;
        this.FailStatus = error.errorStatus || 'Unknown status';
        this.goToCallQuotation();

      }
    },
    goToCallQuotation() {
      this.$router.push({ 
        name: 'Comparison Summary', 
        query: { 
          errorViewMessage: this.FailMessage, 
          errorViewStatus: this.FailStatus 
        } 
      });
    },
    async getCQUnitType(Id) {
      try {
        const processedData = await CallofQuotationController.getUnittype(Id);
        this.CQunitType = processedData;
        if (processedData && processedData.length <= 0) {
          this.isModalVisible = true;
        }
      } catch (error) {
        this.isModalVisible = true; 
      }
    },
    async getUTypes() {
      try {
        const processedData = await CallofQuotationController.getUTypes();
        if (processedData.length > 0) {
          this.UnitTypes = processedData.map(unitType => ({
            ...unitType,
            selected: true 
          }));
        } 
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || 'Fail to find unit types.'}`;
      }
    },
    async confirmSubconSelection() {
      try {
        const cqId = this.$route.query.cqID;
        const selectedUnitTypes = this.UnitTypes.filter(unitType => unitType.selected);
        const processedData = await CallofQuotationController.comparisonAddCQunit(cqId,selectedUnitTypes);
        this.UpdateMessage = processedData; 
        setTimeout(() => {
          this.UpdateMessage = '';
          window.location.reload(0);
        }, 1000);
      } catch (error) {
        this.FailMessage = `Error Message: ${error.message || 'Fail to selection.'}`;
      }
      
    },
  },
};
</script>


<style>

.md-layout-item {
  padding: 0 8px; 
}



.row {
  display: flex;
  align-items: center;
}
.row h6 {
  margin-right: 10px; 
}


.modal-content {
  text-align: center;
  width: 500px;
}





</style>
