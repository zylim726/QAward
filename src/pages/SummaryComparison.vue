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
                  <md-icon style="margin:6px;color: orange; font-size: 28px !important;">add_circle_outline</md-icon>
                </div>
              </div>

              <!-- Table -->
              <md-table v-model="SearchTabledata" :table-header-color="tableHeaderColor">
                <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
                  <md-table-cell md-label="Category">{{  }}</md-table-cell>
                  <md-table-cell md-label="Element">{{  }}</md-table-cell>
                  <md-table-cell md-label="Trade">{{ item.trade }}</md-table-cell>
                  <md-table-cell md-label="Sub Trade">{{  }}</md-table-cell>
                  <md-table-cell md-label="Location 1">{{  }}</md-table-cell>
                  <md-table-cell md-label="AA Budget Amount (RM)">{{ item.amount }}</md-table-cell>
                  <md-table-cell md-label="Subcontract Amount (RM)">{{ item.amount }}</md-table-cell>
                  <md-table-cell md-label="Cost Saving / (Overun) (RM)">{{ item.amount }}</md-table-cell>
                  <md-table-cell md-label="No.of Quote">{{  }}</md-table-cell>
                  <md-table-cell md-label="Target Calling Quotation">{{ item.noquote }}</md-table-cell>
                  <md-table-cell md-label="Actual Calling Received Date">{{ item.date }}</md-table-cell>
                  <md-table-cell md-label="Target Comparison Done Date (K+7 days)">{{  }}</md-table-cell>
                  <md-table-cell md-label="Target Comparison Done Date">{{ item.acctualDonedate }}</md-table-cell>
                  <md-table-cell md-label="Actions">
                    <view-modal :userData="item"></view-modal>
                    <a href="#/comparison" class="text-indigo-500 hover:underLine" ><md-icon style="color: orange;" >edit</md-icon></a>
                    <a href="#" class="text-indigo-500 hover:underLine" style="margin-left:10px;"><md-icon style="color: red;">delete</md-icon></a>
                  </md-table-cell>
                </md-table-row>
              </md-table>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { ViewModal } from "@/components";

export default {
  components: {
    ViewModal,
  },
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
      item: [ 
        {
          id: 1,
          name: "CAR & WC",
          trade: "CAR & WC",
          noquote: "2",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
        },
        {
          id: 2,
          name: "CIDB",
          trade: "CIDB",
          noquote: "2",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
        },
        {
          id: 3,
          name:  "Signboard",
          trade: "Signboard",
          noquote: "",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
        },
        {
          id: 4,
          name: "Temp Water",
          trade: "Temp Water",
          noquote: "4",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
        },
        {
          id: 5,
          name: "Temp. Elec & Lighting",
          trade: "Temp. Elec & Lighting",
          noquote: "2",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
        },{
          id: 6,
          name: "Site Office & Cabin",
          trade: "Site Office & Cabin",
          noquote: "4",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
        },{
          id: 7,
          name: "Security Guard",
          trade: "Security Guard",
          noquote: "1",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
        },{
          id: 8,
          name: "Setting Out",
          trade: "Setting Out",
          noquote: "3",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
        },
        {
          id: 9,
          name: "Photostat machine",
          trade: "Photostat machine",
          noquote: "3",
          date: "11-Sep-24",
          prepareby: "chowps",
          acctualDonedate: "20-Sep-24",
          checkbyLee: "22-Sep-24",
          checkbyKhew: "22-Sep-24",
          checkbyChuah: "22-Sep-24",
          amount: "0.00",
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
    toggleFilter() {
      this.show = !this.show;
    },
  },
};
</script>
