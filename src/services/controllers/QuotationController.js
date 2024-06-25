import { axios, config } from "@/services";

const QuotationController = {
  async addQuotation(QuotationData,SubConName,Discount,Remarks) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();

        const getSubcon = await axios.get(`${apiHost}/subcon/showByName/${SubConName}`, {
            headers,
        });

        const calculateSubcon = getSubcon.data.data;
        let SubconListId = "";
        let subconIdToRetrieve = null;
         
        if (calculateSubcon.length > 0) {

            const checkingSubconList = await axios.get(`${apiHost}/call_for_quotation_subcon_list`, {
                headers,
            });
            
            const GetSubconId = checkingSubconList.data.data;
            const SubconId = calculateSubcon[0].id;
            
            for (const subcon of GetSubconId) {
                if (subcon.subcon_id === Number(SubconId) && subcon.call_for_quotation_id === Number(QuotationData.cqId)) {
                    subconIdToRetrieve = subcon.id;
                    break; 
                }
            }
            
            if (subconIdToRetrieve === null) {
                try {
                    const cqSubconResponse = await axios.post(`${apiHost}/call_for_quotation_subcon_list/add`, {
                        discount: Discount,
                        remark: Remarks,
                        call_for_quotation_id: QuotationData.cqId,
                        subcon_id: SubconId 
                    }, { headers });
            
                    SubconListId = cqSubconResponse.data.data.id;

                } catch (error) {
                  throw error
                }
            } else {
                SubconListId = subconIdToRetrieve;
            }

            const quotationResponse = await axios.post(`${apiHost}/quotation/add`, {
                quote_rate: QuotationData.rate,
                call_for_quotation_subcon_list_id: SubconListId,
                description_id: QuotationData.description_id
            }, {
                headers,
            });
            return quotationResponse.data.message;
            
        } 
    } catch (error) {
        throw error;
    }
  },
  async CMsubmitQuotation(remarksData, approvalDataArray){
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
  async CMrejectedQuotation(cqId){
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
            status: 'Waiting Approval',
        }, { headers });

        return response.data.message;

    } catch (error) {
        throw error;
    }
  },
  async removeSubcon(deleteId) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        let messages = [];
        for (let i = 0; i < deleteId.length; i++) {
            let nestedArray = deleteId[i]; 

            for (let j = 0; j < nestedArray.length; j++) {
                let element = nestedArray[j];
                const response =  await axios.delete(`${apiHost}/quotation/removeByCallForQuotationSubconList/${element}`, { headers });
                messages.push(response.data.message);
            }
        }
        return messages;
    } catch (error) {
        throw error;
    }
  }
  
};

export default QuotationController;

