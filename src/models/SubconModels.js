const SubconModels = {
  processResponseData(response) {
    const dataArray = response.data;

    const processedData = dataArray.map((config) => ({
      id: config.id,
      name: config.name, 
      updatedAt: config.updatedAt,
    }));

    return processedData;
  },
};

export default SubconModels;

