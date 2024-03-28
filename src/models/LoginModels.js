const LoginModel = {
    processResponseData(response) {
      const responseData = response.data || {}; // Ensure response.data exists
      
      return {
        token: String(responseData.accessToken || ''),
        accesslevel: String(responseData.accesslevel || ''),
        username: String(responseData.username || ''),
        message: String(response.message || ''),
      };
    },
  };
  
  
  export default LoginModel;
  