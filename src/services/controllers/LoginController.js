import { axios,Error, API } from "@/services";
import LoginModel from "@/models/LoginModels";

const LoginController = {
  async login(username, password) {
    // Check if username and password are provided
    if (!username || !password) {
      return { success: false, token: null, accesslevel: null, username: null, message: Error.getMessage(400) };
    }

    try {
      const apiHost = API.getHost();
      const response = await axios.post(`${apiHost}/login`, {
        username,
        password,
      });

      const processedData = LoginModel.processResponseData(response.data);

      return {
        token: processedData.token,
        username: processedData.username,
        accesslevel: processedData.accesslevel,
        message: processedData.message,
        success: true,
      };
    } catch (error) {
      let errorMessage;
      if (error.response && error.response.status === 403) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = Error.getMessage(error.response ? error.response.status : null);
      }
      return {
        message: errorMessage,
      };
    }
  },
};

export default LoginController;
