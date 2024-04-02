// Error.js
const Error = {
  getMessage(status) {
    switch (status) {
      case 400:
        return "Please enter both username and password.";
      case 500:
        return "Internal server error. Please try again later.";
      case 503:
        return "Failed to fetch project list:";
      case 504:
        return "An error occurred while fetching projects.";
      case 505:
        return "No users found";
      case 506:
        return "Failed to fetch users";
      default:
        return "An unknown error occurred. Please try again.";
    }
  },
};

export default Error;
