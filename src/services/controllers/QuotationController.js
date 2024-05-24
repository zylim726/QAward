import { axios, config } from "@/services";

const QuotaionController = {
  async addQuotation(QuotationData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const messages = [];

        const getSubcon = await axios.get(`${apiHost}/subcon/showByName/${QuotationData.quotationName}`, {
            headers,
        });

        const calculateSubcon = getSubcon.data.data;

        if (calculateSubcon.length > 0) {
            // Array to hold all promises for asynchronous operations
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

            // Wait for all promises to resolve
            const responses = await Promise.all(promises);

            // Concatenate all messages
            return responses.join(', '); // Or return any other formatted message
        } 
    } catch (error) {
        throw error;
    }
  },
  async addCQApproval(remarksData, approvalDataArray){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        //const userId = localStorage.getItem('userid');
        const userId = '1';
        const messages = [];
        for (const appData of approvalDataArray){

            const response = await axios.post(`${apiHost}/cq_approval/add`, {
                approval_remarks: remarksData,
                approval_status: Approval,
                call_for_quotation_id: appData.cqId,
                call_for_quotation_subcon_list_id: appData.callSubconId,
                system_user_id: userId
            }, { headers });
            console.log('response',response);
            //messages.push(response.data.message);
        }       

        return messages;

    } catch (error) {
        throw error;
    }
  },
};

export default QuotaionController;

