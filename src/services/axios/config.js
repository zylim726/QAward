const config = {
  hosts: {
    backendApi: `${process.env.VUE_APP_QAWARD_BACKEND_HOST}`,
  },

  getTokenFromLocalStorage: () => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("token");
    } else {
      return null;
    }
  },

  getHost: () => {
    return config.hosts.backendApi;
  },

  getHeadersWithToken: () => {
    const token = config.getTokenFromLocalStorage();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  },



};

export default config;
