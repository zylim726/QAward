const CallQuotationModels = {
  processResponseData(response) {
    const dataArray = response.data;
    const projectId = localStorage.getItem('projectId');

    // Filter data based on projectId and status 'Approved'
    const filteredData = dataArray.filter(item => {
      return String(item.project_id) === projectId && item.status === 'Approved';
    });

    // Process the filtered data if there are any matching items
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
        budget_amount: config.budget_amount,
        adj_budget_amount: config.adj_budget_amount,
        adj_subcontract_amount: config.adj_subcontract_amount,
        numberOfQuotations: config.numberOfQuotations,
        provisional_sum: config.provisional_sum,
        subcontract_amount: config.subcontract_amount,
        total_saving: config.total_saving,
        la_id: config.la_id,
        status: config.status,
        projectId: config.project_id,
        message: response.message,
        cqSubconList: config.Call_For_Quotation_Subcon_Lists,
        projectApproval: config.projectApproval,
        La: config.Las,
        cqApprovals: config.cqApprovals,
        Wo: config.Wos,
        is_work_order: config.is_work_order,
      }));

      return processedData;
    }

    // Return an empty array if no data matches the criteria
    return [];
  },
};

export default CallQuotationModels;
