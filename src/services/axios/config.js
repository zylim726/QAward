const config = {
  hosts: {
    // todo: development
    production: "http://103.16.42.51:500",
  },

  getTokenFromLocalStorage: () => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("token");
    } else {
      return null;
    }
  },

  getHost: () => {
    return config.hosts.production;
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
