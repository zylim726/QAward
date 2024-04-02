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
  
      // Fetch all permissions
      const response = await axios.get(`${apiHost}/access_permission`, {
        headers,
      });
  
      const responseData = response.data;
      let message;
  
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        const dataArray = responseData.data;
        const promises = [];
  
        // Check if any permission matches the provided criteria
        const permissionExists = dataArray.some(item => {
          return item.access_level === accesslevel && item.permission === permission && item.module === module;
        });
  
        if (permissionExists) {
          // If permission exists, remove it
          promises.push(
            axios.delete(`${apiHost}/access_permission/remove/${accesslevel}/${permission}`, { headers })
          );
        } else {
          // If permission does not exist, add it
          promises.push(
            axios.post(`${apiHost}/access_permission/add`, {
              access_level: accesslevel,
              module: module,
              permission: permission,
            }, { headers })
          );
        }
  
        // Wait for all promises to resolve
        const results = await Promise.all(promises);
  
        // Process results
        results.forEach(result => {
          message = result.data.message;
          console.log(message);
        });
      }
  
      return message;
    } catch (error) {
      // Handle errors
      console.error('Error updating permission:', error);
      throw { errorMessage: 'An error occurred while updating permission.' };
    }
  }
};

export default PermissionController;


