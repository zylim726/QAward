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
            placeholder="Search by username"
          />
        </form>
      </div>
      
      <div class="filter-container" style="margin-right: -15px">
        <button class="btn-save" @click="showModal = true">
        Add
        </button>
        <Createpermission :show-modal="showModal" @message="ModalMessage" @fail-message="ModalErrorMessage"  @close="closeModal" title="Create Permission"></Createpermission>
      </div>
    </div>
    <div class="table-container" style="max-height: 700px; overflow-y: auto">
      <table class="nested-table">
        <thead>
          <tr>
            <th>Permission</th>
            <th style="text-align: center">QS</th>
            <th style="text-align: center">CM</th>
            <th style="text-align: center">SSA</th>
            <th style="text-align: center">PM</th>
            <th style="text-align: center">PD</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(module, index) in uniqueModules">
            <tr :key="'module_' + index" >
              <td><b>{{ module.module }}</b></td>
              <td colspan="5"></td>
            </tr>
            
            <tr v-for="(permission, pIndex) in module.permissions" :key="'permission_' + pIndex">
              <td>{{ permission }}</td>
              <td style="text-align: center">
                <input
                  type="checkbox"
                  :checked="isPermissionChecked(permission, module.module, 'QS')"
                  @change="updatePermission(permission, module.module, 'QS')">
              </td>
              <td style="text-align: center">
                <input
                  type="checkbox"
                  :checked="isPermissionChecked(permission, module.module, 'CM')"
                  @change="updatePermission(permission, module.module, 'CM')">
              </td>
              <td style="text-align: center">
                <input
                  type="checkbox"
                  :checked="isPermissionChecked(permission, module.module, 'SSA')"
                  @change="updatePermission(permission, module.module, 'SSA')">
              </td>
              <td style="text-align: center">
                <input
                  type="checkbox"
                  :checked="isPermissionChecked(permission, module.module, 'PM')"
                  @change="updatePermission(permission, module.module, 'PM')">
              </td>
              <td style="text-align: center">
                <input
                  type="checkbox"
                  :checked="isPermissionChecked(permission, module.module, 'PD')"
                  @change="updatePermission(permission, module.module, 'PD')">
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <br />
    </div>
    <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import PermissionController from "@/services/controllers/PermissionController.js";
import Createpermission  from "@/components/Modal/Createpermission.vue";


export default {
  components: {
    Createpermission,
  },
  data() {
    return {
      accesss: [],
      searchText: "",
      errorMessage: null,
      UpdateMessage: null,
      FailMessage: null,
      showModal: false,
      permissions: [],
      access: {
        accesslevel: '' 
      }
    };
  },
  mounted() {
    this.accessPermission();
  },
  computed: {
    filteredUsers() {
      return this.accesss.filter((access) => {
        return access.permission
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
      });
    },
    uniqueModules() {
      const uniqueModules = {};
      this.accesss.forEach(module => {
        if (!uniqueModules[module.module]) {
          uniqueModules[module.module] = {
            module: module.module,
            accesslevel: module.accesslevel,
            permissions: [module.permission]
          };
        } else {
          if (!uniqueModules[module.module].permissions.includes(module.permission)) {
            uniqueModules[module.module].permissions.push(module.permission);
          }
        }
      });
      return Object.values(uniqueModules);
    },
    isPermissionChecked() {
      return (permission, module, accesslevel) => {
        const isChecked = this.accesss.some(item =>
          item.permission === permission &&
          item.accesslevel === accesslevel &&
          item.module === module
        );
        return isChecked;
      };
    },
  },
  methods: {
    async accessPermission() {
      try {
        const processedData = await PermissionController.accessPermission();
        this.accesss = processedData;
      } catch (error) {
        this.errorMessage = "Error fetching user data: " + error.errorMessage;
      }
    },
    async updatePermission(permission, module, accesslevel) {
      try {
        const message  = await PermissionController.updatePermission(permission, module, accesslevel);
        this.UpdateMessage = message;
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        this.FailMessage = "Error updating access: " + error.errorMessage;
        setTimeout(() => {
        window.location.reload();
      }, 2000);
      }
    },
    async addPermission() {
      try {
        this.UpdateMessage = await PermissionController.addPermission();
      } catch (error) {
        this.FailMessage = "Error fetching user data: " + error.errorMessage;
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    filterUsers() {},
    ModalMessage(message) {
      this.UpdateMessage = message; 
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    ModalErrorMessage(message) {
      this.FailMessage = message; 
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
  },
};
</script>

<style>
.nested-table th,
.nested-table td {
  padding: 19px !important;
}
</style>
