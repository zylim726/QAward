const config = {
  hosts: {
    backendApi: "http://103.16.42.51:5000",
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
