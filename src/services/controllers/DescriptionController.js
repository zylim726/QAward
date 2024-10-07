import { axios, config } from "@/services";
import { handleApiError } from "@/services/axios/handleApiError.js"; 


const DescriptionController = {
  async addDescription(cqId, matchedData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const messageArray = [];
  
      
        let SubconListId = "";

        
        try {
            const cqSubconResponse = await axios.post(`${apiHost}/call_for_quotation_subcon_list/add`, {
                discount: 0.00,
                call_for_quotation_id: cqId,
                subcon_id: 1 //id 1 is budget
            }, { headers });
    
            SubconListId = cqSubconResponse.data.data.id;
          
        } catch (error) {
          const errorMessage = handleApiError(error);
          throw { errorMessage };
        }
       

        for (const data of matchedData) {
          const descriptionResponse = await axios.post(`${apiHost}/description/add`, {
              element: data.element,
              sub_element: data.sub_element,
              description_sub_sub_element: data.description_sub_sub_element,
              description_unit: data.description_unit,
              description_item: data.description
          }, { headers });
       
          const quotationResponse = await axios.post(`${apiHost}/quotation/add`, {
              quote_rate: data.budget,
              call_for_quotation_subcon_list_id: SubconListId,
              description_id: descriptionResponse.data.data.id
          }, { headers });

          for (const [unitId, value] of Object.entries(data.matchedValues)) {
            try {
                const descriptionCQUnitResponse = await axios.post(`${apiHost}/description_cq_unit_type_list/add`, {
                    cq_unit_type_id: unitId,
                    description_id: descriptionResponse.data.data.id,
                    quantity: value
                }, { headers });

                const message = descriptionCQUnitResponse.data.message;
                messageArray.push(message);
            } catch (error) {
                const errorMessage = handleApiError(error);
                throw { errorMessage };
            }
          }
        }

        return messageArray;

    } catch (error) {
     
        const errorMessage = handleApiError(error);
        throw { errorMessage };
    }
  },
  async getDescriptionDetail(id){
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/description/${id}`, {
        headers,
      });
      return response.data.data;

    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
  async editDescription(id, updatedData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const response = await axios.put(`${apiHost}/description/edit/${id}`, {
          element: updatedData.element, 
          sub_element: updatedData.sub_element, 
          description_sub_sub_element: updatedData.description_sub_sub_element, 
          description_item: updatedData.description_item,  
          description_unit: updatedData.description_unit,
          quantity: updatedData.quantity
        }, { headers });
        return response.data.message;
    } catch (error) {
      const errorMessage = handleApiError(error);
        throw { errorMessage };
    }
  },
  async getNewDescription(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const response = await axios.get(`${apiHost}/description/calculateByCallForQuotation/${id}`, {
        headers,
      });

      return response.data.data;

    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }

  },
  async getTotalQuotation(id,SubconId){
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/quotation/calculateBySubcon/${id}/${SubconId}`, {
        headers,
      }); 
      return response.data.data;

    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
  async editQuotation(dataToSave,discount, remark,Documents) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const messageArray = [];
      const token = localStorage.getItem('token');


      

      if (Documents && Documents.file) {
        const formData = new FormData();
        formData.append('file', Documents.file);
        formData.append('data-table', 'call_for_quotation_subcon_list');
        formData.append('data-table-id', dataToSave[0].subconListId);
        formData.append('description', 'edit quotation quantity');
        formData.append('name', Documents.file.name);
       
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
     
      const CQListresponse = await axios.put(`${apiHost}/call_for_quotation_subcon_list/edit/${dataToSave[0].subconListId}`, 
      {
        discount : discount,
        remark : remark
      }, { headers, });
      

      for (const data of dataToSave){

      
        const Quoteresponse = await axios.put(`${apiHost}/quotation/edit/${data.quotationId}`, 
        {
          quote_rate: data.rate,

        }, { headers, });

        messageArray.push(Quoteresponse.data.message);
        
      }
      
      return messageArray;

    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
  async editQuantity(dataToSave) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const messageArray = [];
     
      for (const data of dataToSave){
    
        const Quoteresponse = await axios.put(`${apiHost}/description_cq_unit_type_list/edit/${data.cqUnitTypeId}`, 
        {
          adj_quantity : data.adj_quantity,
          remeasurement_quantity : data.remeasurement_quantity,

        }, { headers, });

        messageArray.push(Quoteresponse.data.message);
        
      }
      
      return messageArray;

    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  }
};

export default DescriptionController;

