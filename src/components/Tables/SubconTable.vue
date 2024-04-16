<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div class="container" style="margin-top: 20px">
      <div class="search-container">
        <form class="Searchbar">
          <input
            type="text"
            v-model="searchText"
            @input="filterUsers"
            placeholder="Search by subcon"
          />
        </form>
      </div>
      
      <div class="filter-container" style="margin-right: -15px">
        <button class="btn-save" @click="showModal = true" v-if="hasAccess">
          Add
        </button>
        <Createsubcon :show-modal="showModal"  @message="ModalMessage" @fail-message="ModalErrorMessage"  @close="closeModal" title="Create Subcon"></Createsubcon>
      </div>
    </div>
    <div class="table-container" style="max-height: 700px; overflow-y: auto">
      <table class="nested-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Subcon Name</th>
            <th>Update Date</th>
            <th style="text-align: center;" v-if="hasAccess">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(subcon, index) in filterSubcon" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ subcon.name }}</td>
            <td>{{ subcon.updatedAt }}</td>
            <td style="text-align: center" v-if="hasAccess">
              <button class="transparentButton"  @click="editSubcon(subcon.id)" style="margin-left: -6px;"><md-icon class="mdIcon">edit</md-icon></button>
              <button class="transparentButton"  @click="deleteSubcon(subcon.id)" style="margin-left: -6px;"><md-icon class="mdIcon">delete</md-icon></button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
    <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import SubconController from "@/services/controllers/SubconController.js";
import Createsubcon from "@/components/Modal/Createsubcon.vue";
import { checkAccess } from "@/services/axios/accessControl.js";
export default {
  components: {
    Createsubcon,
  },
  data() {
    return {
      subcons: [],
      searchText: "",
      errorMessage: null,
      UpdateMessage: null,
      FailMessage: null,
      showModal: false,
      hasAccess: false,
    };
  },
  async created() {
    await this.checkPermission();
  },
  mounted() {
    this.accessSubcon();
  },
  computed: {
    filterSubcon() {
      return this.subcons.filter((subcon) => {
        return subcon.name.toLowerCase().includes(this.searchText.toLowerCase());
      });
    },
  },
  methods: {
    async accessSubcon() {
      try {
        const processedData = await SubconController.accessSubcon();
        this.subcons = processedData;
      } catch (error) {
        this.errorMessage = "Error fetching subcon data: " + error.errorMessage;
      }
    },
    // async updatePermission(permission, module, accesslevel) {
    //   try {
    //     this.UpdateMessage = await SubconController.updatePermission(permission, module, accesslevel);
    //     this.accessSubcon(); 
    //   } catch (error) {
    //     this.FailMessage = "Error updating access: " + error.errorMessage;
    //   }
    // },
    // editSubcon(subconId) {
    //   // Implement your logic for editing a subcon
    // },
    // deleteSubcon(subconId) {
    //   // Implement your logic for deleting a subcon
    // },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    filterUsers() {
      // Implement your filtering logic if needed
    },
    ModalMessage(message) {
      this.UpdateMessage = message; 
      this.accessSubcon(); 
    },
    ModalErrorMessage(message) {
      this.FailMessage = message; 
    },
    async checkPermission() {
      try {
        const permission = await checkAccess(); 
        const accessIds = ['Add-Edit-Remove Subcon'];
        this.hasAccess = accessIds.some(id => permission.includes(id));
      } catch (error) {
        console.error('Error checking permission:', error);
      }
    } 
  },
};
</script>

<style>
.nested-table th,
.nested-table td {
  padding: 19px !important;
}
</style>
