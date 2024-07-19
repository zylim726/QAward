import { axios, config } from "@/services";
import LoginModel from "@/models/LoginModels";
import { handleApiError } from "@/services/axios/handleApiError.js"; // Ensure correct import path

const LoginController = {
  async login(username, password) {
    if (!username || !password) {
      const errorMessage = handleApiError({ response: { status: 400 } }); 
      return { success: false, token: null, accesslevel: null, username: null, message: errorMessage };
    }

    try {
      const apiHost = config.getHost();
      const response = await axios.post(`${apiHost}/login`, {
        username,
        password,
      });

      const processedData = LoginModel.processResponseData(response.data);

      return {
        token: processedData.token,
        username: processedData.username,
        userid: processedData.userid,
        accesslevel: processedData.accesslevel,
        message: processedData.message,
        success: true,
      };
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
    }
  },
};

export default LoginController;
