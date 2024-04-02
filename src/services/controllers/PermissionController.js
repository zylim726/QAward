import { axios, config } from "@/services";
import PermissionModels from "@/models/PermissionModels.js";

const PermissionController = {
  async accessPermission() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/access_permission`, {
        headers,
      });

      const processedData = PermissionModels.processResponseData(response.data);
  
      return processedData;

    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
  async addPermission(module, permission) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();

      const response = await axios.post(
        `${apiHost}/access_permission/add`,
        {
          access_level: 'MasterPermission',
          module: module,
          permission: permission,
        },
        { headers }
      );
      return response.data.message;
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };

    }
  },
  async updatePermission(permission, module, accesslevel) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/access_permission`, {
        headers,
      });

      let message; 

      if (response.data.accesslevel === accesslevel && response.data.permission === permission) {
          message = update.data.message; 
      } else {
          const updateData = await axios.post(
              `${apiHost}/access_permission/add`,
              {
                  access_level: accesslevel,
                  module: module,
                  permission: permission,
              },
              { headers }
          );
          message = updateData.data.message;
      }

      return message;
    } catch (error) {
      // Handle errors
      console.error('Error updating permission:', error);
      return 'An error occurred while updating permission.';
    }
  }
};

export default PermissionController;






