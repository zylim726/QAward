import { axios, config } from "@/services";
import { handleApiError } from "@/services/axios/handleApiError.js"; 

const MaintenanceController = {
  async checkMaintenance() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const response = await axios.get(`${apiHost}/maintenance/getMaintenanceStatus`, {
       headers,
      });
     
      return response.data.data; 

    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
};

export default MaintenanceController;
