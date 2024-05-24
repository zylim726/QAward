
const UnittypeModels = {
  processResponseData(response) {
    const dataArray = response.data;
    const processedData = dataArray.map(config => ({
      id: config.id,
      type: config.type,
      adj_factor: config.adj_factor,
      quantity: config.quantity,
      message: response.message 
    }));
    
    return processedData;
  } 
};

export default UnittypeModels;
