import { axios, config } from "@/services";
import PermissionModels from "@/models/PermissionModels.js";

const PermissionController = {
  async permissionAccess() {
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
        { access_level: 'MasterPermission',
          module: module,
          permission: permission, },
        { headers }
      );
      return response.data.message;
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
  async updatepermission(user) {
    try {
      
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();

      const response = await axios.put(
        `${apiHost}/user_configuration/edit/${user.id}`,
        {
          access_level:user.accesslevel,
          login_allowed: user.loginAllowed,
        },
        { headers }
      );
      
      return response.data.message;
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
};

export default PermissionController;

