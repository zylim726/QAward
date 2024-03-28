import { axios, Error, config } from "@/services";
import ConfigModels from "@/models/ConfigModels.js";

const AccessUserController = {
  async accessUser() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); // Correct usage of headers

      const response = await axios.get(`${apiHost}/user_configuration`, {
        headers,
      });

      const processedData = ConfigModels.processResponseData(response.data);
  
      return processedData;

    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
  async updateUserLoginAllowed(user) {
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

export default AccessUserController;

