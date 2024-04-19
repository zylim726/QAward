const PermissionModels = {
  processResponseData(response) {
    const dataArray = response.data;

    const processedData = dataArray.map((config) => ({
      id: config.id,
      accesslevel: config.access_level, 
      module: config.module,
      permission: config.permission,
      message: response.message,
    }));
    return processedData;
  },
};

export default PermissionModels;