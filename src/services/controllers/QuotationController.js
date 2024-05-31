import { axios, config } from "@/services";

const QuotationController = {
  async addQuotation(QuotationData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();

        const getSubcon = await axios.get(`${apiHost}/subcon/showByName/${QuotationData.quotationName}`, {
            headers,
        });

        const calculateSubcon = getSubcon.data.data;
   
        if (calculateSubcon.length > 0) {
            const promises = calculateSubcon.map(async (item) => {
                try {
                    const cqSubconResponse = await axios.post(`${apiHost}/call_for_quotation_subcon_list/add`, {
                        call_for_quotation_id: QuotationData.cqId,
                        subcon_id: item.id
                    }, {
                        headers,
                    });

                    const cqSubcon = cqSubconResponse.data.data;

                    const quotationResponse = await axios.post(`${apiHost}/quotation/add`, {
                        quote_rate: QuotationData.rate,
                        call_for_quotation_subcon_list_id: cqSubcon.id,
                        description_id: QuotationData.description_id
                    }, {
                        headers,
                    });
                    return quotationResponse.data.message;

                } catch (error) {
                    const errorMessage = error.quotationData.data.message;
                    throw { errorMessage };
                }
            });

            const responses = await Promise.all(promises);

            return responses.join(', '); 
        } 
    } catch (error) {
        throw error;
    }
  },
  async addApproval(remarksData, approvalDataArray){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const messages = [];
        const cqId = approvalDataArray[0].cqId;
        
        const response = await axios.put(`${apiHost}/call_for_quotation/edit/${cqId}`, {
            remarks: remarksData,
            status: 'Waiting Approval',
        }, { headers });

        console.log('response',response);
        messages.push(response.data.message);
            

        return messages;

    } catch (error) {
        throw error;
    }
  },
  async getCQApproval(){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const ProjectId = localStorage.getItem('projectId');
        
        const response = await axios.get(`${apiHost}/project_approval/showByProject/${ProjectId}`, { headers });

        return response.data.data;

    } catch (error) {
        throw error;
    }
  },
  async addCQApproval(approvalDataToSubmit){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const dataToSubmitFiltered = approvalDataToSubmit.filter(data => data.SubconListId !== undefined);
        const messages = [];

        for (const data of dataToSubmitFiltered) {
            const response = await axios.post(`${apiHost}/cq_approval/add`, {
                approval_remarks: data.remark,
                approval_status: 'Approval',
                call_for_quotation_id: data.cqId,
                call_for_quotation_subcon_list_id: data.SubconListId,
                system_user_id: data.userId
            }, { headers });

            messages.push(response.data.message);
        }
        
        return messages;

    } catch (error) {
        throw error;
    }
  },
  async rejectedQuotation(cqId){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();

        const response = await axios.put(`${apiHost}/call_for_quotation/edit/${cqId}`, {
            status: 'Pending',
        }, { headers });

    
        return response.data.message;

    } catch (error) {
        throw error;
    }
  },
  async approvalQuotation(cqId){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();

        const response = await axios.put(`${apiHost}/call_for_quotation/edit/${cqId}`, {
            status: 'Approval',
        }, { headers });

        return response.data.message;

    } catch (error) {
        throw error;
    }
  },
};

export default QuotationController;

