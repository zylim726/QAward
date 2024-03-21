// Error.js
const Error = {
    getMessage(status) {
      switch (status) {
        case 400:
          return 'Please enter both username and password.';
        case 401:
          return 'You do not have the necessary access level to login.';
        case 403:
          return 'Sorry, your username or password is incorrect.';
        case 500:
          return 'Internal server error. Please try again later.';
        case 501:
            return "You don't have any projects";
        default:
          return 'An unknown error occurred. Please try again.';
      }
    },
  };
  
  export default Error;
  