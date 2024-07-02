<template>
  <div class="content">
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div v-if="isModalVisible && CQunitType.length === 0" class="modal-overlay">
      <div class="modal-content" style="max-height: 600px;">
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
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card style="height: 70%">
          <div class="status">
            <i class="material-icons">notifications_active</i>
            <h7>Status : <b class="titleHeader">{{ callQuotation.status }}</b></h7>
          </div>
          <div class="comparison-title">
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h6>Project :</h6>
              <h3 class="titleHeader">{{ projectName }}</h3>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h6>Category :</h6>
              <h3 class="titleHeader">{{ callQuotation.trade_category }}</h3>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h6>Trade :</h6>
              <h3 class="titleHeader">{{ callQuotation.trade }}</h3>
            </div>

            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h6>Location 1 :</h6>
              <h3 class="titleHeader">{{ callQuotation.trade_location1 }}</h3>
            </div>
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-17">
              <h6>Prepare :</h6>
              <h3 class="titleHeader">{{ callQuotation.updated_by }}</h3>
            </div>
            <div class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-11">
              <h6>Awading Target Data :</h6>
              <h3 class="titleHeader">{{ callQuotation.awading_target_date }}</h3>
            </div>
            <button class="transparentButton"  @click="editCallQuotation(callQuotation.id)" >
                <div class="tooltip">
                  <span class="tooltiptext">Edit Comparison Summary</span>
                  <md-icon style="color: orange;">edit_square</md-icon></div></button>
              <br>
              <button class="transparentButton" @click="deleteCallQuotation(callQuotation.id)" >
                <div class="tooltip" v-if="getDescription && getDescription.lengt === 0"  >
                  <span class="tooltiptext">Delete Comparison Summary</span>
                  <md-icon style="color: orange;">delete</md-icon></div></button>
          </div>
        </md-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
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
import { ComparisonTable } from "@/components";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";
import { Error } from "@/services";
import { EditCQ,DeleteCQ }  from "@/components";
import DescriptionController from "../services/controllers/DescriptionController";

export default {
  components: {
    ComparisonTable,
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
      getDescription:[],
      UpdateMessage: null,
      FailMessage: null,
      editModal: false,
      deleteId: null,
      editId: null,
      editUTId: null,
    };
  },
  mounted() {
    const projectName = localStorage.getItem('projectName');
    if (projectName) {
      this.projectName = projectName;
    } else {
    };
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
    async getDetailCQ(Id) {
      try {
        const processedData = await CallofQuotationController.getDetailCQ(Id);
        this.getDescription = await DescriptionController.getNewDescription(Id);
        this.callQuotation = processedData[0];
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
        if (error.errorMessage === undefined) {
          this.FailMessage = "Error cq description: " + Error.getMessage(504);
        } else {
          this.FailMessage = "Error cq description: " + error.errorMessage;
        }
      }
    },
    async getCQUnitType(Id) {
      try {
        const processedData = await CallofQuotationController.getUnittype(Id);
        this.CQunitType = processedData;
        if (processedData && processedData.length <= 0) {
          this.isModalVisible = true;
        }
      } catch (error) {
        if (error.errorMessage === undefined) {
          this.FailMessage = "Error unit tyoe: " + Error.getMessage(504);
        } else {
          this.FailMessage = "Error unit tyoe: " + error.errorMessage;
        }
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
        } else {
          this.FailMessage = "No unit types available. Please set up unit types in the Project Setup.";
        }
      } catch (error) {
        this.FailMessage = "Fail to find unit types.";
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
        if (error.errorMessage === undefined) {
          this.FailMessage = "Error confirm selection: " + Error.getMessage(504);
        } else {
          this.FailMessage = "Error confirm selection: " + error.errorMessage;
        }
      }
      
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
  padding: 0 8px; 
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
  margin-right: 10px; 
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  text-align: center;
  width: 500px;
}

.status {
  display: flex;
  background-color: antiquewhite;
  padding: 17px;
  justify-content: center
}

.status .material-icons {
  font-size: 20px;
  margin-right: 10px;
  color: orange;
}



</style>
