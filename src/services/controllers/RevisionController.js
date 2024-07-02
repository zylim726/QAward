import { axios, config } from "@/services";

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
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  }
};

export default RevisionController;


