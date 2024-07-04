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
            <th>Name</th>
            <th>Reg No</th>
            <th>Gst Id</th>
            <th>Email</th>
            <th>Short Code</th>
            <th>Phone</th>
            <th style="text-align: center;" v-if="hasAccess">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(subcon, index) in filterSubcon" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ subcon.name }}</td>
            <td>{{ subcon.reg_no }}</td>
            <td>{{ subcon.gst_id }}</td>
            <td>{{ subcon.email_1 }}</td>
            <td>{{ subcon.short_code }}</td>
            <td>{{ subcon.contact_person }}({{ subcon.phone }})</td>
            <td style="text-align: center" v-if="hasAccess">
              <button class="transparentButton"  @click="deleteSub(subcon.id)" style="margin-left: -6px;"><md-icon style="color: orange !important;">delete</md-icon></button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
    <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
    <DeleteSubcon :delete-subcon="showDeleteModal" @deletemessage="DeleteMessage" @deletefail-message="DeleteErrorMessage" @close="closeDeleteModal" :id="deleteId" title="Delete Subcon"></DeleteSubcon>
  </div>
</template>

<script>
import SubconController from "@/services/controllers/SubconController.js";
import Createsubcon from "@/components/Pop-Up-Modal/Createsubcon.vue";
import DeleteSubcon from "@/components/Pop-Up-Modal/DeleteSubcon.vue";
import { checkAccess } from "@/services/axios/accessControl.js";

export default {
  components: {
    Createsubcon,
    DeleteSubcon 
  },
  data() {
    return {
      subcons: [],
      searchText: "",
      errorMessage: null,
      UpdateMessage: null,
      FailMessage: null,
      hasAccess: false,
      showModal: false,
      showEditModal: false,
      showDeleteModal: false,
      deleteId: null
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
    deleteSub(subconId) {
      this.deleteId = subconId;
      this.showDeleteModal = true; 
    },
    closeDeleteModal() {
      this.showDeleteModal = false; 
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    ModalMessage(message) {
      this.UpdateMessage = message; 
      this.accessSubcon(); 
    },
    ModalErrorMessage(message) {
      this.FailMessage = message; 
    },
    DeleteMessage(message) {
      this.UpdateMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    DeleteErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        this.UpdateMessage = '';
      }, 2000);
    },
    async checkPermission() {
      try {
        const permission = await checkAccess(); 
        const accessIds = ['Add-Remove Subcon'];
        this.hasAccess = accessIds.some(id => permission.includes(id));
      } catch (error) {
        console.error('Error checking permission:', error);
      }
    } 
  },
};
</script>


