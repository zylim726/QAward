import {  config } from "@/services";
import axios from 'axios';

const QuotationController = {
  async addQuotation(QuotationData,SubConName,Discount,Remarks,Documents,id) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const token = localStorage.getItem('token');
        const getSubcon = await axios.get(`${apiHost}/subcon/showByName/${SubConName}`, {
            headers,
        });

        
        const calculateSubcon = getSubcon.data.data;
        let SubconListId = "";
        let subconIdToRetrieve = null;
        const messages = [];
         
        if (calculateSubcon.length > 0) {

            const checkingSubconList = await axios.get(`${apiHost}/call_for_quotation_subcon_list`, {
                headers,
            });
            
            const GetSubconId = checkingSubconList.data.data;
            const SubconId = calculateSubcon[0].id;
            
            for (const subcon of GetSubconId) {
                if (subcon.subcon_id === Number(SubconId) && subcon.call_for_quotation_id === Number(id)) {
                    subconIdToRetrieve = subcon.id;
                    break; 
                }
            }

            if (subconIdToRetrieve === null) {
                
                try {
                    const cqSubconResponse = await axios.post(`${apiHost}/call_for_quotation_subcon_list/add`, {
                        discount: Discount,
                        remark: Remarks,
                        call_for_quotation_id: id,
                        subcon_id: SubconId 
                    }, { headers });
            
                    SubconListId = cqSubconResponse.data.data.id;

                } catch (error) {
                  throw error
                }
            } else {
                SubconListId = subconIdToRetrieve;
            }

            const formData = new FormData();
            formData.append('file', Documents.file);
            formData.append('data-table', 'call_for_quotation_subcon_list');
            formData.append('data-table-id', SubconListId);
            formData.append('description', 'update quotation description');
            formData.append('name', 'quotation.xlsx');

            // Perform the axios request
            const response = await axios.post(
                `${apiHost}/document/importExcel`, 
                formData, 
                { 
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
        
            for (const quotation of QuotationData) {
     
                try {
                    const quotationResponse = await axios.post(`${apiHost}/quotation/add`, {
                        quote_rate: quotation.rate,
                        call_for_quotation_subcon_list_id: SubconListId,
                        description_id: quotation.description_id
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
    
                    messages.push(quotationResponse.data.message);
                } catch (quotationError) {
                    throw quotationError;
                }
            }

            return messages;
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
  async getCMcqApproval(id){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        
        const response = await axios.get(`${apiHost}/cq_approval/showByCallForQuotation/${id}`, { headers });

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

        console.log('dataToSubmit',dataToSubmitFiltered);

       
        for (const data of dataToSubmitFiltered) {
            const response = await axios.post(`${apiHost}/cq_approval/add`, {
                approval_remarks: data.remark,
                approval_status: 'Approval',
                approval_type: 'Admin Approval',
                call_for_quotation_id: data.cqId,
                call_for_quotation_subcon_list_id: data.SubconListId,
                system_user_id: data.userId
            }, { headers });

            console.log('response',response);

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
  async getCMSubmit(){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();

        const response = await axios.get(`${apiHost}/call_for_quotation_subcon_list`, { headers });
    
        return response.data.data;

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
  async addApproval(remarksData, selectedQuotation, CQid){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const Userid = localStorage.getItem('userid');

        const getComparisonSummary = await axios.put(`${apiHost}/call_for_quotation/edit/${CQid}`, {
            status: 'Approval',
        }, { headers });

 
        const response = await axios.post(`${apiHost}/cq_approval/add`, {
            approval_remarks: remarksData,
            approval_status: 'Approval',
            approval_type: 'CM Approval',
            call_for_quotation_id: CQid,
            call_for_quotation_subcon_list_id: selectedQuotation,
            system_user_id: Userid
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
      
        const response =  await axios.delete(`${apiHost}/quotation/removeByCallForQuotationSubconList/${deleteId}`, { headers });
        const CQresponse =  await axios.delete(`${apiHost}/call_for_quotation_subcon_list/remove/${deleteId}`, { headers });
       
        return CQresponse.data.message;
    } catch (error) {
        throw error;
    }
  }
  
};

export default QuotationController;

