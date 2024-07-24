const ApproveCQLaModels = {
  processResponseData(response) {
    const dataArray = response.data;

    if (dataArray.length > 0) {
      const processedData = dataArray.map(config => {
        return {
          id: config.id,
          code: config.la_code,
          cqId: config.call_for_quotation_id,
          trade: config.trade,
          sub_element: config.sub_element,
          sub_sub_element: config.sub_sub_element,
          skilled_worker_rate: config.skilled_worker_rate,
          provisional_sum: config.provisional_sum,
          retention: config.retention,
          remarks: config.remarks,
          contract_sum: config.contract_sum,
          category: config.category,
          subconName: config.Subcon.name,
          updateDate: config.updatedAt,
          updateBy: config.updated_by,
        };
      });

      return processedData;
    }

    // Return an empty array if no data matches the criteria
    return [];
  },
};

export default ApproveCQLaModels;
