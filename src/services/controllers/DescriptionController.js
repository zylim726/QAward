import { axios, config } from "@/services";
import { handleApiError } from "@/services/axios/handleApiError.js"; 


const DescriptionController = {
  async addDescription(cqId, matchedData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        
        const descriptionResponse = await axios.post(`${apiHost}/call_for_quotation_subcon_list/addBudget`, {
          call_for_quotation_id: cqId,
          subcon_id: 1,
          matchedData: matchedData,
      }, { headers });

      return descriptionResponse.data.message;

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
  async removeDescription(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
  
      // Convert the id object into an array of values
      const idArray = Object.values(id);

      const requestData = {
        description_ids: idArray
      };

      const response = await axios.delete(`${apiHost}/description/remove`, {
        headers,
        data: requestData 
      });   

      console.log('response',response);
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
  async getFullDetails(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      console.log('id show full api',id);
      const response = await axios.get(`${apiHost}/call_for_quotation/comparisonTable/${id}`, {
        headers,
      });
      console.log('response',response.data);

      return response.data;

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
  async editQuotation(dataToSave,discount, remark,Documents,qtName) {
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
        remark : remark,
        name: qtName
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
          quantity : data.bq_quantity,
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

