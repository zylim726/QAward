const ConfigModels = {
  processResponseData(response) {
    const dataArray = response.data;
 

    // Map over the filtered data to transform it
    const processedData = dataArray.map((config) => ({
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

