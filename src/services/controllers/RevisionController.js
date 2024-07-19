import { axios, config } from "@/services";
import { handleApiError } from "@/services/axios/handleApiError.js"; 

const RevisionController = {
  async accessRevision(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const response = await axios.get(`${apiHost}/revision/showByCallForQuotation/${id}`, {
        headers,
      });
      return response.data.data;

    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
    }
  }
};

export default RevisionController;


