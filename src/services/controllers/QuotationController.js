import { axios, config } from "@/services";

const QuotaionController = {
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
        
        const response = await axios.post(`${apiHost}/call_for_quotation/edit/${cqId}`, {
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
};

export default QuotaionController;

