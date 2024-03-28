const config = {
  // Define your API hosts
  hosts: {
    production: "https://subconbackend.tribit.com.my",
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
