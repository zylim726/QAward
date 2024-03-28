const ConfigModels = {
  processResponseData(response) {
    const dataArray = response.data;
    const filteredData = dataArray.filter(
      (config) => config.access_level !== "SSA" && config.access_level !== "PA"
    );

    // Map over the filtered data to transform it
    const processedData = filteredData.map((config) => ({
      id: config.id,
      username: config.username,
      accesslevel: config.access_level,
      loginAllowed: config.login_allowed,
      updatedAt: config.updatedAt, 
      message: response.message
    }));
    return processedData;
  },
};

export default ConfigModels;

