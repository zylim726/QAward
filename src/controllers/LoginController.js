import axios from 'axios';
import Error from '../models/error'; 

const accessRoles = ['PM', 'PD', 'SSA', 'CM', 'QS'];

const LoginController = {
  async login(username, password) {
    if (!username || !password) {
      return { success: false, token: null, accesslevel: null, username: null, message: Error.getMessage(400) };
    }

    try {
      const response = await axios.post(
        "https://subconbackend.tribit.com.my/login",
        { username, password }
      );

      if (response.status === 200) {
        const { accessToken, accesslevel,username } = response.data;
        
        if (accessRoles.includes(accesslevel)) {
          return { success: true, token: accessToken, accesslevel: accesslevel, username: username };
        } else {
          return { success: false, token: null, accessLevel: null,username: null, message: Error.getMessage(401) };
        }

      } else {
        return { success: false, token: null, accesslevel: null,username: null, message: Error.getMessage(403) };
      }
    } catch (error) {
      let errorMessage = Error.getMessage(error.response ? error.response.status : null);
      return { success: false, token: null, accesslevel: null,username: null, message: errorMessage };
    }
  },
};

export default LoginController;
