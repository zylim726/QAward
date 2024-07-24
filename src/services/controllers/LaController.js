import { axios, config } from "@/services";
import ApproveCQModels from "@/models/ApproveCQModels.js";
import ApproveCQLaModels from "@/models/ApproveCQLaModels.js";
import { handleApiError } from "@/services/axios/handleApiError.js"; 

const LaController = {
  async accessWO(woCqId) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/wo/showByCallForQuotation/${woCqId}`, {
        headers,
      })

      const processedData = ApproveCQModels.processResponseData(response.data);
     
      return processedData;

      
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
  async accessLa(laCqId) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/la/showByCallForQuotation/${laCqId}`, {
        headers,
      })

      const processedData = ApproveCQLaModels.processResponseData(response.data);
     
      return processedData;

      
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
};

export default LaController;

