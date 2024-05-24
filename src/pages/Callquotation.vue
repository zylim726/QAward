<template>
  <div class="content">
    <div class="md-layout">
      <div class="row" style="margin-left: 16px">
        <h6>Project Name :</h6>
        <h3 class="titleHeader">{{ projectName }}</h3>
        <br >
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content style="font-size: 13px !important;line-height: 17px !important">
            <div>
              <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
              <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
              <br>
              <div class="container">
                <div class="search-container">
                  <form class="Searchbar">
                    <input
                      type="text"
                      v-model="searchQuery"
                      placeholder="Search"
                    />
                  </form>
                </div>

                <div class="filter-container" style="margin-right: -15px">
                  <a href="createcq" v-if="hasAccess"
                    ><md-icon class="mdIcon" style="margin-right: 15px"
                      >add</md-icon
                    ></a
                  >
                </div>
              </div>
              <div class="table-container" style="min-height: 100px;max-height: 600px;">
                <table>
                  <thead>
                    <tr>
                      <th>Actions</th>
                      <th>ID</th>
                      <th>Category</th>
                      <th>Trade</th>
                      <th>Location 1</th>
                      <th>No.of Quote</th>
                      <th>Actual Calling Quotation Date</th>
                      <th>Prepare By</th>
                      <th>Actual Done Date</th>
                      <th colspan="3" style="text-align: center">Check By</th>
                      <th>Awarding Target Date</th>
                      <th>Remarks</th>
                      <th>Awarded to</th>
                      <th>LA Ref</th>
                      <th>LA Date</th>
                      <th>Budget Amount (RM)</th>
                      <th>Budget (ADJ) Amount (RM)</th>
                      <th>Subcontract Amount (RM)</th>
                      <th>Subcontract (ADJ) Amount (RM)</th>
                      <th>Cost Saving / (Overrun) (RM)</th>
                      <th style="text-align: center">Status</th>
                    </tr>
                    <tr>
                      <th colspan="9"></th>
                      <th>Mr Lim</th>
                      <th>Mr Khew</th>
                      <th>Mr Chuah</th>
                      <th colspan="11"></th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    <tr v-if="errorMessage" ><td colspan="23" class="message">{{ errorMessage }}</td></tr>
                    <tr v-for="(callQuotation, index) in SearchcallQuotation" :key="index">
                      <td>
                        <li class="md-list-item">
                          <drop-down
                            @dropdown-clicked="closeOtherDropDowns(item)"
                          >
                            <md-button
                              slot="title"
                              class="md-button md-just-icon md-simple"
                              data-toggle="dropdown"
                            >
                              <md-icon>more_vert</md-icon>
                            </md-button>
                            <ul
                              class="dropdown-menu dropdown-menu-left"
                              style="margin-left: 48px !important"
                            >
                              <li>
                                <a :href="'/comparison?cqID=' + callQuotation.id">Subcon Comparison</a>
                              </li>
                              <li><button class="transparentButton"  v-if="hasAccess" @click="editCallQuotation(callQuotation.id)" style="margin-left: -6px;">Edit</button></li>
                              <li><button class="transparentButton"  v-if="hasAccess" @click="deleteCallQuotation(callQuotation.id)" style="margin-left: -6px;">Delete</button></li>
                            </ul>
                          </drop-down>
                        </li>
                      </td>
                      <td>{{ index + 1 }}</td>
                      <td>{{ callQuotation.tradeCategory }}</td>
                      <td>{{ callQuotation.trade }}</td>
                      <td>{{ callQuotation.location }}</td>
                      <td></td>
                      <td>{{ callQuotation.CallingQuotationDate }}</td>
                      <td>{{ callQuotation.createdby }}</td>
                      <td>{{ callQuotation.actuallDoneDate }}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{{ callQuotation.awadingtargetdate }}</td>
                      <td>{{ callQuotation.remarks }}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{{ callQuotation.budget_amount }}</td>
                      <td>{{ callQuotation.adj_budget_amount }}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <span class="notify-status">{{ callQuotation.status }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <EditCQ :edit-modal="editModal" @editMessage="EditMessage" @editfail-message="EditErrorMessage" @close="closeEditModal" :id="editId"  title="Edit Call of Quotation"></EditCQ>
    <DeleteCQ :show-modal="showModal" @message="ModalMessage" @fail-message="ModalErrorMessage" @close="closeModal" :id="deleteId" title="Delete Call of Quotation"></DeleteCQ>
  </div>
</template>

<script>
import { ref } from "vue";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";
import { EditCQ,DeleteCQ }  from "@/components";
import {  Error } from "@/services";
import { checkAccess } from "@/services/axios/accessControl.js";

export default {
  components: {
    EditCQ,
    DeleteCQ
  },
  data() {
    return {
      show: ref(false),
      searchQuery: "",
      openedDropdown: null,
      projectName: "",
      errorMessage: "",
      callQuotation: [],
      editModal: false,
      showModal: false,
      deleteId: null,
      editId: null,
      UpdateMessage: null,
      FailMessage: null,
      item: null,
      hasAccess: false,
    };
  },
  computed: {
    SearchcallQuotation() {
      let searchData = this.callQuotation;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        searchData = searchData.filter(
          (callQuotation) =>
            callQuotation.trade.toLowerCase().includes(query) ||
            callQuotation.tradeCategory.toLowerCase().includes(query) ||
            callQuotation.location.toLowerCase().includes(query)
        );
      }
      return searchData;
    },
  },
  mounted() {
    const projectName = localStorage.getItem('projectName');
    if (projectName) {
      this.projectName = projectName;
    } else {
      console.error('Project ID not found in localStorage');
    };
    this.accessCQ();
  },
  async created() {
    await this.checkPermission();
  },
  methods: {
    async accessCQ() {
      try {
        const processedData = await CallofQuotationController.accessCQ();
        if (processedData.length > 0) {
          this.callQuotation = processedData;
        } else {
          this.errorMessage = "An error occurred while fetching projects.";
        }
      } catch (error) {
        this.errorMessage = "Error fetching data: " + error.errorMessage;
      }
    },
    closeOtherDropDowns(clickedItem) {
      if (this.openedDropdown && this.openedDropdown !== clickedItem) {
        this.openedDropdown.dropdown.closeDropDown();
      }
      this.openedDropdown = clickedItem;
    },
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
    async checkPermission() {
      try {
        const permission = await checkAccess(); 
        const accessIds = ['Add-Edit-Remove CQ'];
        this.hasAccess = accessIds.some(id => permission.includes(id));
      } catch (error) {
        console.error('Error checking permission:', error);
      }
    } 
  },
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  color: #333;
  overflow-x: auto; 
}

thead th {
  background-color: #fef4e4;
  border-bottom: none;
  padding: 10px;
  text-align: left;

}

tbody td {
  padding: 12px;
  text-align: left;
  white-space: nowrap; 
  border: 1px solid #ddd;
}
</style>
