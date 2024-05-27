const LoginModel = {
    processResponseData(response) {
      const responseData = response.data || {}; 
      return {
        token: String(responseData.accessToken || ''),
        accesslevel: String(responseData.accesslevel || ''),
        username: String(responseData.username || ''),
        userid: String(responseData.user_id || ''),
        message: String(response.message || ''),
      };
    },
  };
  
  
  export default LoginModel;
  