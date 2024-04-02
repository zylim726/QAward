const ConfigModels = {
  processResponseData(response) {
    const dataArray = response.data;
    const filteredData = dataArray.filter(
      (config) => config.accesslevel !== "SSA" && config.accesslevel !== "PA"
    );

    // Map over the filtered data to transform it
    const processedData = filteredData.map((config) => ({
      id: config.id,
      username: config.username,
      name: config.name,
      accesslevel: config.accesslevel,
      loginAllowed: config.subcon_login_access,
      message: response.message
    }));
    return processedData;
  },
};

export default ConfigModels;

