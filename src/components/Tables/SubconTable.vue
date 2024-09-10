<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">{{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon></div>
    <div v-if="FailMessage" class="notification fail">{{ FailMessage }} <md-icon>cancel</md-icon></div>
    <div v-if="isLoading"><loading-modal /><br><br></div>
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
              <button class="transparentButton"  @click="editSub(subcon.id)" style="margin-left: -6px;"><md-icon style="color: orange !important;">edit</md-icon></button>
              <button class="transparentButton"  @click="deleteSub(subcon.id)" style="margin-left: -6px;"><md-icon style="color: orange !important;">delete</md-icon></button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
    <EditSubcon :edit-subcon="showEditModal" @editMessage="EditMessage" @editfail-message="EditErrorMessage"  @close="closeEditModal" :id="editId" title="Edit Subcon"></EditSubcon>
    <DeleteSubcon :delete-subcon="showDeleteModal" @deletemessage="DeleteMessage" @deletefail-message="DeleteErrorMessage" @close="closeDeleteModal" :id="deleteId" title="Delete Subcon"></DeleteSubcon>
  </div>
</template>

<script>
import SubconController from "@/services/controllers/SubconController.js";
import Createsubcon from "@/components/Pop-Up-Modal/Createsubcon.vue";
import EditSubcon from "@/components/Pop-Up-Modal/EditSubcon.vue";
import DeleteSubcon from "@/components/Pop-Up-Modal/DeleteSubcon.vue";
import { checkAccess } from "@/services/axios/accessControl.js";
import LoadingModal from "@/components/Pop-Up-Modal/LoadingModal.vue";

export default {
  components: {
    Createsubcon,
    EditSubcon,
    DeleteSubcon,
    LoadingModal 
  },
  data() {
    return {
      subcons: [],
      searchText: "",
      UpdateMessage: null,
      FailMessage: null,
      hasAccess: false,
      showModal: false,
      showEditModal: false,
      showDeleteModal: false,
      editId: null,
      deleteId: null,
      isLoading: false,
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
        this.isLoading = true;
        const processedData = await SubconController.accessSubcon();
        this.subcons = processedData;
      } catch (error) {
        this.isLoading = false;
        this.FailMessage = `Error Message: ${error.errorMessage || 'Unknown Data.'}`;
      } finally {
        this.isLoading = false;
      }
    },
    editSub(subconId) {
      this.editId = subconId;
      this.showEditModal = true; 
    },
    closeEditModal() {
      this.showEditModal = false; 
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
        const accessIds = ['Add-Edit-Remove Subcon'];
        this.hasAccess = accessIds.some(id => permission.includes(id));
      } catch (error) {
      }
    } 
  },
};
</script>


<style>
.nested-table td {
  padding: 15px !important;
}
</style>
