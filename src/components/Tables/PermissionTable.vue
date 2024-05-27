<template>
  <div>
    <div v-if="UpdateMessage" class="notification success">
      {{ UpdateMessage }} <md-icon style="color:green">check_circle_outline</md-icon>
    </div>
    <div v-if="FailMessage" class="notification fail">
      {{ FailMessage }} <md-icon>cancel</md-icon>
    </div>
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
        <button class="btn-save" @click="showModal = true">Add</button>
        <Createpermission
          :show-modal="showModal"
          @message="ModalMessage"
          @fail-message="ModalErrorMessage"
          @close="closeModal"
          title="Create Permission"
        ></Createpermission>
      </div>
    </div>
    <div class="table-container">
        <div class="table-row table-header">
          <div class="table-cell">Permission</div>
          <div class="table-cell">QS</div>
          <div class="table-cell">CM</div>
          <div class="table-cell">SSA</div>
          <div class="table-cell">PM</div>
          <div class="table-cell">PD</div>
        </div>
        <div v-for="(module, index) in uniqueModules" :key="moduleKeys[index]">
          <div class="table-row module-header">
            <div class="table-cell module-name"><b>{{ module.module }}</b></div>
            <div class="table-cell"></div>
            <div class="table-cell"></div>
            <div class="table-cell"></div>
            <div class="table-cell"></div>
            <div class="table-cell"></div>
          </div>
          <div v-for="(permission, pIndex) in module.permissions" :key="'_permission_' + pIndex" class="table-row">
            <div class="table-cell">{{ permission }}</div>
            <div class="table-cell">
              <input
                type="checkbox"
                :checked="isPermissionChecked(permission, module.module, 'QS')"
                @change="updatePermission(permission, module.module, 'QS')"
              />
            </div>
            <div class="table-cell">
              <input
                type="checkbox"
                :checked="isPermissionChecked(permission, module.module, 'CM')"
                @change="updatePermission(permission, module.module, 'CM')"
              />
            </div>
            <div class="table-cell">
              <input
                type="checkbox"
                :checked="isPermissionChecked(permission, module.module, 'SSA')"
                @change="updatePermission(permission, module.module, 'SSA')"
              />
            </div>
            <div class="table-cell">
              <input
                type="checkbox"
                :checked="isPermissionChecked(permission, module.module, 'PM')"
                @change="updatePermission(permission, module.module, 'PM')"
              />
            </div>
            <div class="table-cell">
              <input
                type="checkbox"
                :checked="isPermissionChecked(permission, module.module, 'PD')"
                @change="updatePermission(permission, module.module, 'PD')"
              />
            </div>
          </div>
        </div>
    </div>
    <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import PermissionController from "@/services/controllers/PermissionController.js";
import Createpermission  from "@/components/Pop-Up-Modal/Createpermission.vue";

export default {
  components: {
    Createpermission,
  },
  data() {
    return {
      accesss: [],
      filteredAccesss: [], // Initialize filteredAccesss array
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
    uniqueModules() {
      const uniqueModules = {};
      this.filteredAccesss.forEach(module => {
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
        const isChecked = this.filteredAccesss.some(item =>
          item.permission === permission &&
          item.accesslevel === accesslevel &&
          item.module === module
        );
        return isChecked;
      };
    },
    moduleKeys() {
      return this.uniqueModules.map((module, index) => 'module_' + index);
    },
    computedRows() {
      // Generate an array of objects with module and key properties
      return this.uniqueModules.map((module, index) => ({
        module: module,
        key: 'module_' + index, // Use a unique key for each module
      }));
    },
  },
  methods: {
    async accessPermission() {
      try {
        const processedData = await PermissionController.accessPermission();
        this.accesss = processedData;
        this.filteredAccesss = processedData; 
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
    closeModal() {
      this.showModal = false;
    },
    filterUsers() {
      // Convert searchText to lowercase for case-insensitive filtering
      const searchTerm = this.searchText.toLowerCase();

      // Filter accesss data based on searchText
      this.filteredAccesss = this.accesss.filter(access => {
        return access.permission.toLowerCase().includes(searchTerm);
      });
    },
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
.table-container {
  margin-top: -25px;
}


.table-row {
  display: flex;
  width: 100%;
}

.table-cell {
  flex: 1;
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #f2f2f2;
}

.table-header {
  background-color: #f2f2f2;
  font-weight: bold;
}

.module-header .table-cell {
  font-weight: bold;
  text-align: left;
}

.table-cell input[type="checkbox"] {
  transform: scale(1.5);
}

.module-name {
  flex: 1;
  text-align: left;
}

</style>
