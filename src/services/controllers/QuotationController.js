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
                console.log('quotation',quotation);
                try {
                    const quotationResponse = await axios.post(`${apiHost}/quotation/add`, {
                        quote_rate: quotation.rate,
                        call_for_quotation_subcon_list_id: SubconListId,
                        description_id: quotation.description_id
                    },  { headers });
    
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
                    approval_type: 'QS',
                    approval_status: 'Approved',
                    call_for_quotation_id: data.cqId,
                    call_for_quotation_subcon_list_id: data.callForQuotationListId
                }, { headers });

                
                messages.push(response.data.message);
                
            }
        }
        
         return messages;

    } catch (error) {
        throw error;
    }
  },
  async rejectCQApproval(approvalDataToSubmit,documents){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const token = localStorage.getItem('token');
        let foundId = null;
        const messages = [];

        const revisionResponse = await axios.post(`${apiHost}/revision/add`, {
            call_for_quotation_id: approvalDataToSubmit[0].cqId,
        }, { headers });


        const revisionId = revisionResponse.data.data.id;

        const formData = new FormData();
        formData.append('file', documents.file);
        formData.append('data-table', 'revision');
        formData.append('data-table-id', revisionId);
        formData.append('description', approvalDataToSubmit[0].remark);
        formData.append('name', 'revision.xlsx');

        const Importresponse = await axios.post(
            `${apiHost}/document/importExcel`, 
            formData, 
            { 
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            }
        );

  
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
                        approval_type: 'QS',
                        approval_status: 'Reject',
                        call_for_quotation_id: data.cqId,
                        call_for_quotation_subcon_list_id: data.callForQuotationListId
                    }, { headers });
                    console.log('cqApprovalResponse',cqApprovalResponse);

                    
                    const response = await axios.put(`${apiHost}/call_for_quotation/edit/${data.cqId}`, {
                        status: 'Pending',
                    }, { headers });

                    messages.push(cqApprovalResponse.data.message);
                }
                    
            } catch (error) {
                throw error;
            }
        }

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
  async approvalQuotation(cqId,getDataFile){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const token = localStorage.getItem('token');
    
        const revisionResponse = await axios.post(`${apiHost}/revision/add`, {
            call_for_quotation_id: cqId,
            version: 'version',
        }, { headers });

        const revisionId = revisionResponse.data.data.id;

        const formData = new FormData();
        formData.append('file', getDataFile);
        formData.append('data-table', 'revision');
        formData.append('data-table-id', revisionId);
        formData.append('description', 'update revision');
        formData.append('name', 'revision.xlsx');
        // Log FormData keys and values
        for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
        console.log('Sending request to:', `${apiHost}//document/importExcel`);
        
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
            status: 'Waiting Checking',
        }, { headers });

        return CQresponse.data.message;

    } catch (error) {
        throw error;
    }
  },
  async addApproval(remarksData, selectedQuotation, CQid){
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        

        const getComparisonSummary = await axios.put(`${apiHost}/call_for_quotation/edit/${CQid}`, {
            status: 'Waiting Approval'
        }, { headers });

        const response = await axios.post(`${apiHost}/cq_approval/add`, {
            approval_remarks: remarksData,
            approval_type: 'CM',
            call_for_quotation_id: CQid,
            call_for_quotation_subcon_list_id: selectedQuotation
        }, { headers });

        return response.data.message;

    } catch (error) {
        throw error;
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
        
        const formData = new FormData();
        formData.append('file', getFile.file);
        formData.append('data-table', 'revision');
        formData.append('data-table-id', revisionId);
        formData.append('description', 'update revision');
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
        throw error;
    }
  }
  
};

export default QuotationController;

