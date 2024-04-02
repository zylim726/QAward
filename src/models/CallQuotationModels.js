const CallQuotationModels = {
  processResponseData(response) {
    const dataArray = response.data;
    const projectId = localStorage.getItem('projectId');


    const filteredData = dataArray.filter(item => {
      //console.log('Comparing projectId:', item.project_id, 'with', projectId);

      if (String(item.project_id) === projectId) {
        return true;
      } else {
        return false;
      }
    });

    if (filteredData.length > 0) {
      const processedData = filteredData.map(config => ({
        id: config.id,
        tradeCategory: config.trade_category,
        trade: config.trade,
        location: config.trade_location1,
        CallingQuotationDate: config.actual_calling_quotation_date,
        createdby: config.created_by,
        updatedby: config.updated_by,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
        actuallDoneDate: config.actual_done_date,
        awadingtargetdate: config.awading_target_date,
        remarks: config.remarks,
        la_id: config.la_id,
        status: config.status,
        projectId: config.project_id,
        message: response.message 
      }));
      
      return processedData;
    } 
  },
};

export default CallQuotationModels;
