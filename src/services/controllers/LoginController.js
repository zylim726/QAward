// import { axios,Error,config, } from "@/services";
// import LoginModel, { LoginResponse } from "@/models/LoginModels";

// const LoginController = {
//   async login(username, password) {
//     if (!username || !password) {
//       return { success: false, token: null, accesslevel: null, username: null, message: Error.getMessage(400) };
//     }

//     try {
//       const apiHost = config.getHost();
//       const response = await axios.post(
//         `${apiHost}/login`,
//         { username, password }
//       );

//       if (response.status === 200) {
//         const { accessToken, accesslevel,username } = response.data;

//         return { success: true, token: accessToken, accesslevel: accesslevel, username: username };

//       } else {
//         return { success: false, token: null, accesslevel: null,username: null, message: Error.getMessage(403) };
//       }
//     } catch (error) {
//       let errorMessage = Error.getMessage(error.response ? error.response.status : null);
//       return { success: false, token: null, accesslevel: null,username: null, message: errorMessage };
//     }
//   },
// };

// export default LoginController;

import { axios, Error, config } from "@/services";
import LoginModel from "@/models/LoginModels";

const LoginController = {
  async login(username, password) {
    try {
      const apiHost = config.getHost();
      const response = await axios.post(`${apiHost}/login`, {
        username,
        password,
      });

      const processedData = LoginModel.processResponseData(response.data);

      // return LoginModel.processResponseData(response);

      console.log("Controller", processedData);
    } catch (error) {
      let errorMessage = Error.getMessage(
        error.response ? error.response.status : null
      );
      throw new Error(errorMessage);
    }
  },
};

export default LoginController;
