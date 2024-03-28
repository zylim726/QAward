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
      throw error;
    }
  },
  async updateUserLoginAllowed(user) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();

      // Construct the API endpoint with the username included
      const endpoint = `${apiHost}/user_configuration/edit/${user.username}`;

      // Send a PUT request to update the user's configuration
      const response = await axios.put(
        endpoint,
        {
          login_allowed: user.loginAllowed,
        },
        { headers }
      );

      const formattedData = ConfigModels.processResponseData(response.data);

      return formattedData;
    } catch (error) {
      throw error;
    }
  },
};

export default AccessUserController;
