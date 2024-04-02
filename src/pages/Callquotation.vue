<template>
  <div class="content">
    <div class="md-layout">
      <div class="row" style="margin-left: 16px">
        <h6>Project Name :</h6>
        <h3 class="titleHeader">{{ projectName }}</h3>
        <br />
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <div>
              <div class="container">
                <!-- Search bar -->
                <div class="search-container">
                  <form class="Searchbar">
                    <input
                      type="text"
                      v-model="searchQuery"
                      placeholder="Search"
                    />
                  </form>
                </div>

                <!-- Filter -->
                <div class="filter-container" style="margin-right: -15px">
                  <a href="createcq"
                    ><md-icon class="mdIcon" style="margin-right: 15px"
                      >add</md-icon
                    ></a
                  >
                </div>
              </div>
              <div class="table-container" style="min-height: 500px;">
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
                      <th>Cost Saving / (Overrun) (RM)</th>
                      <th style="text-align: center">Status</th>
                    </tr>
                    <tr>
                      <th colspan="9"></th>
                      <th>Mr Lim</th>
                      <th>Mr Khew</th>
                      <th>Mr Chuah</th>
                      <th colspan="8"></th>
                    </tr>
                  </thead>
                  <tbody>
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
                                <a href="comparison">Subcon Comparison</a>
                              </li>
                              <li><a href="">Edit</a></li>
                              <li><a href="">Delete</a></li>
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
    <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { ref } from "vue";
import CallofQuotationController from "@/services/controllers/CallofQuotationController.js";

export default {
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: ref(false),
      searchQuery: "",
      openedDropdown: null,
      projectName: "",
      errorMessage: "",
      callQuotation: [],
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
  },
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  color: #333;
  overflow-x: auto; /* Enable horizontal scrolling */
}

thead th {
  background-color: #fef4e4;
  border-bottom: none;
  padding: 12px;
  text-align: left;
  white-space: nowrap; /* Prevent text wrapping */
}

tbody td {
  padding: 12px;
  text-align: left;
  white-space: nowrap; /* Prevent text wrapping */
  border: 1px solid #ddd;
}
</style>
