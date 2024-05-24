const LoginModel = {
    processResponseData(response) {
      const responseData = response.data || {}; // Ensure response.data exists
      console.log('responsedDa',responseData);
      return {
        token: String(responseData.accessToken || ''),
        accesslevel: String(responseData.accesslevel || ''),
        username: String(responseData.username || ''),
        id: String(responseData.id || ''),
        message: String(response.message || ''),
      };
    },
  };
  
  
  export default LoginModel;
  