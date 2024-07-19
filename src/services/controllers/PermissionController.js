import { axios, config } from "@/services";
import PermissionModels from "@/models/PermissionModels.js";
import { handleApiError } from "@/services/axios/handleApiError.js"; 

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
      const errorMessage = handleApiError(error);
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
      const errorMessage = handleApiError(error);
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
  
      const responseData = response.data;
      let message;

      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        const dataArray = responseData.data;
        const promises = [];
  
        const permissionExists = dataArray.some(item => {
          return item.access_level === accesslevel && item.permission === permission && item.module === module;
        });

        if (permissionExists) {
          promises.push(
            axios.delete(`${apiHost}/access_permission/remove/${accesslevel}/${permission}`, { headers })
          );
        } else {
          promises.push(
            axios.post(`${apiHost}/access_permission/add`, {
              access_level: accesslevel,
              module: module,
              permission: permission,
            }, { headers })
          );
        }
  
        const results = await Promise.all(promises);
  
        results.forEach(result => {
          message = result.data.message;
        });
      }
  
      return message;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
    }
  }
};

export default PermissionController;


