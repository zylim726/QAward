import { axios, config } from "@/services";
import ProjectModels from "@/models/ProjectModels.js";

const ProjectController = {
  async projectList() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const response = await axios.get(`${apiHost}/sitelist`, { headers });

      const processedData = ProjectModels.processResponseData(response.data);

      console.log(processedData);

      return {
        data: processedData,
        message: null, 
      };
    } catch (error) {
      let errorMessage;

      if (error.response && error.response.status === 403) {
        errorMessage = error.response.data.message;
      } 
      return {
        data: null,
        message: errorMessage,
      };
    }
  },
};

export default ProjectController;
