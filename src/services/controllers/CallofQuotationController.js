import { axios, Error, config } from "@/services";
import CallQuotationModels from "@/models/CallQuotationModels.js";

const CallofQuotationController = {
  async accessCQ() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/call_for_quotation`, {
        headers,
      });

      const processedData = CallQuotationModels.processResponseData(response.data);
      
      return processedData;
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  }
};

export default CallofQuotationController;

