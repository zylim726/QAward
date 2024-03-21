<template>
  <div class="content">
    <div class="md-layout">
      <div class="row" style="margin-left:16px">
          <h6>Project Name :</h6>
          <h3 class="titleHeader">AR496</h3><br>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-content>
            <div>
              <div class="container">
                <!-- Search bar -->
                <div class="search-container">
                    <form class="Searchbar">
                        <input type="text" v-model="searchQuery" placeholder="Search" />
                    </form>
                </div>

                <!-- Filter -->
                <div class="filter-container" style="margin-right:-15px">
                  <a href="#/latrade"><md-icon class="mdIcon" style="margin-right: 15px;">add</md-icon></a>
                </div>
              </div>

              <!-- Table -->
              <div class="table-container">
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
                    <th colspan="3" style="text-align: center;">Check By</th>
                    <th>Awarding Target Date</th>
                    <th>Remarks</th>
                    <th>Awarded to</th>
                    <th>LA Ref</th>
                    <th>Cost Saving / (Overrun) (RM)</th>
                    <th style="text-align: center;">Status</th>
                  </tr>
                  <tr>
                    <th colspan="8"></th>
                    <th>Mr Lim</th>
                    <th>Mr Khew</th>
                    <th>Mr Chuahc</th>
                    <th colspan="9"></th>
                  </tr>
                </thead >
                <tbody>
                  <tr v-for="item in SearchTabledata" :key="item.id">
                    <!-- <td>
                      <li class="md-list-item">
                        <drop-down>
                          <md-button
                            slot="title"
                            class="md-button md-just-icon md-simple"
                            data-toggle="dropdown" >
                            <md-icon>more_vert</md-icon>
                          </md-button>
                          <ul class="dropdown-menu dropdown-menu-left" style="margin-left: 48px !important;">
                            <li><a href="#/comparison">Subcon Comparison</a></li>
                            <li><a href="#/comparison">Edit</a></li>
                            <li><a href="#/comparison">Delete</a></li>
                          </ul>
                        </drop-down>
                      </li>
                    </td> -->
                    <td>
      <li class="md-list-item">
        <drop-down
          @dropdown-clicked="closeOtherDropDowns(item)"
        >
        <md-button
          slot="title"
          class="md-button md-just-icon md-simple"
          data-toggle="dropdown">
          <md-icon>more_vert</md-icon>
        </md-button>
        <ul class="dropdown-menu dropdown-menu-left" style="margin-left: 48px !important;">
          <li><a href="#/comparison">Subcon Comparison</a></li>
          <li><a href="#/comparison">Edit</a></li>
          <li><a href="#/comparison">Delete</a></li>
        </ul>
        </drop-down>
      </li>
    </td>
                    <td>{{ item.id }}</td>
                    <td>{{ item.category }}</td>
                    <td>{{ item.trade }}</td>
                    <td>{{ item.location }}</td>
                    <td>{{ item.noOfQuote }}</td>
                    <td>{{ item.actualCalling }}</td>
                    <td>{{ item.prepareBy }}</td>
                    <td>{{ item.actualDonedate }}</td>
                    <td>{{ item.checkby1 }}</td>
                    <td>{{ item.checkBy2 }}</td>
                    <td>{{ item.checkBy3 }}</td>
                    <td>{{ item.awardingTarget }}</td>
                    <td>{{ item.remarks }}</td>
                    <td>{{ item.awardedto }}</td>
                    <td>{{ item.LAref }}</td>
                    <td>{{ item.costSaving  }}</td>
                    <td><span class="notify-status">Waiting Approval</span></td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';


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
      item: [ 
        {
          id: 1,
          category: "",
          trade: "Waterprofing",
          location : "Location",
          noquote: "2",
          actualCalling: "11-Sep-24",
          prepareby: "chowps",
          actualDonedate: "20-Sep-24",
          checkby1: "22-Sep-24",
          checkBy2: "22-Sep-24",
          checkBy3: "22-Sep-24",
          awardingTarget: "",
          remarks: "",
          awardedto: "",
          LAref: "",
          costSaving: "0.00",
        },
        {
          id: 2,
          category: "",
          trade: "Setting Out",
          location : "Location",
          noquote: "2",
          actualCalling: "11-Sep-24",
          prepareby: "chowps",
          actualDonedate: "20-Sep-24",
          checkby1: "22-Sep-24",
          checkBy2: "22-Sep-24",
          checkBy3: "22-Sep-24",
          awardingTarget: "",
          remarks: "",
          awardedto: "",
          LAref: "",
          costSaving: "0.00",
        },
        {
          id: 3,
          category: "",
          trade: "CAR & WC",
          location : "Location",
          noquote: "2",
          actualCalling: "11-Sep-24",
          prepareby: "chowps",
          actualDonedate: "20-Sep-24",
          checkby1: "22-Sep-24",
          checkBy2: "22-Sep-24",
          checkBy3: "22-Sep-24",
          awardingTarget: "",
          remarks: "",
          awardedto: "",
          LAref: "",
          costSaving: "0.00",
        },
        {
          id: 4,
          category: "",
          trade: "Temp. Water",
          location : "Location",
          noquote: "2",
          actualCalling: "11-Sep-24",
          prepareby: "chowps",
          actualDonedate: "20-Sep-24",
          checkby1: "22-Sep-24",
          checkBy2: "22-Sep-24",
          checkBy3: "22-Sep-24",
          awardingTarget: "",
          remarks: "",
          awardedto: "",
          LAref: "",
          costSaving: "0.00",
        },
        {
          id: 5,
          category: "",
          trade: "Signboard",
          location : "Location",
          noquote: "2",
          actualCalling: "11-Sep-24",
          prepareby: "chowps",
          actualDonedate: "20-Sep-24",
          checkby1: "22-Sep-24",
          checkBy2: "22-Sep-24",
          checkBy3: "22-Sep-24",
          awardingTarget: "",
          remarks: "",
          awardedto: "",
          LAref: "",
          costSaving: "0.00",
        },{
          id: 6,
          category: "",
          trade: "CIDB",
          location : "Location",
          noquote: "2",
          actualCalling: "11-Sep-24",
          prepareby: "chowps",
          actualDonedate: "20-Sep-24",
          checkby1: "22-Sep-24",
          checkBy2: "22-Sep-24",
          checkBy3: "22-Sep-24",
          awardingTarget: "",
          remarks: "",
          awardedto: "",
          LAref: "",
          costSaving: "0.00",
        },
       ],
    };
  },
  computed: {
    SearchTabledata() {
      let searchData = this.item;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        searchData = searchData.filter(item =>
          item.trade.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.prepareby.toLowerCase().includes(query)
        );
      }
    
      return searchData;
    },
  },
  methods: {
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