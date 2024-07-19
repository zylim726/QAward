const Error = {
  getMessage(status) {
    switch (status) {
      case 400:
        return "Please enter both username and password.";
      case 401:
        return "Unauthorised.";
      case 403:
        return "Invalid Credential.";
      case 404:
        return "Not Found.";
      case 408:
        return "Request Time-Out.";
      case 500:
        return "Internal server error. Please try again later.";
      case 503:
        return "Service Unavailable.";
      case 504:
        return "Data is not available.";
      case 505:
        return "No users found.";
      case 506:
        return "Failed to fetch users.";
      default:
        return "An unknown error occurred. Please try again.";
    }
  },
};

export default Error;
