import { axios, Error, config } from "@/services";

const ProjectController = {
  async projectList() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const response = await axios.get(`${apiHost}/sitelist`, { headers });

      return response.data;
    } catch (error) {
      return { message: Error.getMessage(503) + error.message };
    }
  },
};

export default ProjectController;
