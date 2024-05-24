const getProjectModels = {
  processResponseData(response) {
    const dataArray = response.data;

    const processedData = dataArray.map((config) => ({
      id: config.id,
      name: config.name, 
      updatedAt: config.updatedAt,
      regno: config.regno,
      area: config.area,
      code: config.code,
    }));

    return processedData;
  },
};

export default getProjectModels;

