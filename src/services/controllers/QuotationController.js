import {  config } from "@/services";
import axios from 'axios';
import { handleApiError } from "@/services/axios/handleApiError.js"; 


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
        const messages = [];

     
        if (calculateSubcon.length > 0) {

            const SubconId = calculateSubcon[0].id; 
           
            const cqSubconResponse = await axios.post(`${apiHost}/call_for_quotation_subcon_list/add`, {
                discount: Discount,
                remark: Remarks,
                call_for_quotation_id: id,
                subcon_id: SubconId 
            }, { headers });

            SubconListId = cqSubconResponse.data.data.id;


            if (Documents && Documents.file) {
                const formData = new FormData();
                formData.append('file', Documents.file);
                formData.append('data-table', 'call_for_quotation_subcon_list');
                formData.append('data-table-id', SubconListId);
                formData.append('description', 'update quotation');
                formData.append('name', Documents.file.name);
            
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
            }
            
            for (const quotation of QuotationData) {

                try {
                    const quotationResponse = await axios.post(`${apiHost}/quotation/add`, {
                        quote_rate: quotation.rate,
                        call_for_quotation_subcon_list_id: SubconListId,
                        description_id: quotation.description_id
                    },  { headers });
    
                    messages.push(quotationResponse.data.message);
                } catch (quotationError) {
                    const errorMessage = handleApiError(quotationError);
                    throw errorMessage;
                }
            }
          
            return messages;
        } 
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
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

        messages.push(response.data.message);
    

        return messages;

    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
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
        const errorMessage = handleApiError(error);
        throw errorMessage;
    }
  },
  async getCMcqApproval(id){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        
        const response = await axios.get(`${apiHost}/cq_approval/showByCallForQuotation/${id}`, { headers });

        return response.data.data;

    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
    }
  },
  async addCQApproval(approvalDataToSubmit){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const messages = [];
        let foundId = null;
        for (const data of approvalDataToSubmit) {
            const Cqresponse = await axios.get(`${apiHost}/cq_approval/showByCallForQuotation/${data.cqId}`, { headers });

            const CheckCQ = Cqresponse.data.data;
            CheckCQ.forEach(cq => {
            if (cq.system_user_id === Number(data.userId)) {
                
                foundId = cq.id;
            }
            });

            if (foundId){
            
                const response = await axios.put(`${apiHost}/cq_approval/edit/${foundId}`, {
                    approval_remarks: data.remark,
                    approval_status: 'Approved',
                    call_for_quotation_id: data.cqId,
                    call_for_quotation_subcon_list_id: data.callForQuotationListId
                }, { headers });

                
                messages.push(response.data.message);
                
            }
        }
        
         return messages;

    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
    }
  },
  async rejectCQApproval(approvalDataToSubmit){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const token = localStorage.getItem('token');
        let foundId = null;
        const messages = [];
  
        for (const data of approvalDataToSubmit) {
            try {

                const Cqresponse = await axios.get(`${apiHost}/cq_approval/showByCallForQuotation/${data.cqId}`, { headers });

                const CheckCQ = Cqresponse.data.data;
                CheckCQ.forEach(cq => {
                    if (Number(cq.system_user_id) === Number(data.userId)) {
                        foundId = cq.id;
                    }
                });


                if (foundId){

                    const cqApprovalResponse = await axios.put(`${apiHost}/cq_approval/edit/${foundId}`, {
                        approval_remarks: data.remark,
                        approval_type: '',
                        approval_status: 'Reject',
                        call_for_quotation_id: data.cqId,
                        call_for_quotation_subcon_list_id: data.callForQuotationListId
                    }, { headers });
                   
                    const response = await axios.put(`${apiHost}/call_for_quotation/edit/${data.cqId}`, {
                        status: 'Pending',
                    }, { headers });

                    messages.push(cqApprovalResponse.data.message);
                }else {

                    const response = await axios.put(`${apiHost}/call_for_quotation/edit/${data.cqId}`, {
                        status: 'Pending',
                    }, { headers });


                    messages.push(response.data.message);
                }
                    
            } catch (error) {
                const errorMessage = handleApiError(error);
                throw errorMessage;
            }
        }

        return response.data.message;

    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
    }
  },
  async getCMSubmit(){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();

        const response = await axios.get(`${apiHost}/call_for_quotation_subcon_list`, { headers });
    
        return response.data.data;

    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
    }
  },
  async approvalQuotation(cqId,getDataFile){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const token = localStorage.getItem('token');

        const revisionResponse = await axios.post(`${apiHost}/revision/add`, {
            call_for_quotation_id: cqId,
        }, { headers });

        const revisionId = revisionResponse.data.data.id;
        

        const formData = new FormData();
        formData.append('file', getDataFile);
        formData.append('data-table', 'revision');
        formData.append('data-table-id', revisionId);
        formData.append('description', 'Submit cost comparison');
        formData.append('name', 'revision.xlsx');

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

        const CQresponse = await axios.put(`${apiHost}/call_for_quotation/edit/${cqId}`, {
            status: 'Waiting Approval',
        }, { headers });

        const approvalResponse = await axios.post(`${apiHost}/cq_approval/add`, {
            approval_remarks: '',
            approval_type: '',
            approval_status: 'Pending',  
            call_for_quotation_id: cqId,
            call_for_quotation_subcon_list_id: ''
        }, { headers });

        return CQresponse.data.message;

    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
    }
  },
  async CMrejectedQuotation(remarksData,CQid,getFile){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const token = localStorage.getItem('token');


        const revisionResponse = await axios.post(`${apiHost}/revision/add`, {
            call_for_quotation_id: CQid,
        }, { headers });

        const revisionId = revisionResponse.data.data.id;
        const getInformation = 'CM rejected :' + remarksData;

        
        const formData = new FormData();
        formData.append('file', getFile.file);
        formData.append('data-table', 'revision');
        formData.append('data-table-id', revisionId);
        formData.append('description', getInformation);
        formData.append('name', 'revision.xlsx');
       
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

        const getComparisonSummary = await axios.put(`${apiHost}/call_for_quotation/edit/${CQid}`, {
            status: 'Pending',
            remarks: remarksData
        }, { headers });

        return getComparisonSummary.data.message;

    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
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
        const errorMessage = handleApiError(error);
        throw errorMessage;
    }
  },
  async updateWorkOrder(checked,cqId) {
    try {

        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
      
        if(checked === true) {
            const response = await axios.put(`${apiHost}/call_for_quotation/edit/${cqId}`, {
                is_work_order : 1
            }, { headers });
        }else {
            const response = await axios.put(`${apiHost}/call_for_quotation/edit/${cqId}`, {
                is_work_order : 0
            }, { headers });
        }
    
        
        return response.data.message;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage;
    }
  }
  
};

export default QuotationController;

