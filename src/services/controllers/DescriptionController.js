import { axios, config } from "@/services";

const DescriptionController = {
  async addDescription(cqId, matchedData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const messageArray = [];

        const checkingSubconList = await axios.get(`${apiHost}/call_for_quotation_subcon_list`, {
            headers,
        });
        
        const GetSubconId = checkingSubconList.data.data;
        const SubconId = "1";
        let SubconListId = "";
        let subconIdToRetrieve = null;
        
        for (const subcon of GetSubconId) {
            if (subcon.subcon_id === Number(SubconId) && subcon.call_for_quotation_id === Number(cqId)) {
                subconIdToRetrieve = subcon.id;
                break; 
            }
        }
        
        if (subconIdToRetrieve === null) {
            try {
                const cqSubconResponse = await axios.post(`${apiHost}/call_for_quotation_subcon_list/add`, {
                    discount: 0.00,
                    call_for_quotation_id: cqId,
                    subcon_id: SubconId 
                }, { headers });
        
                SubconListId = cqSubconResponse.data.data.id;
            } catch (error) {
              throw error
            }
        } else {
          
            SubconListId = subconIdToRetrieve;
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
                throw error;
            }
          }
        }

        return messageArray;

    } catch (error) {
        throw error;
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
      const errorMessage = error.response.data.message;
    
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
        const errorMessage = error.response.data.message;
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
      const errorMessage = error.response.data.message;
    
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
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
      
    }
  },
  async editQuotation(dataToSave,discount) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const messageArray = [];

      console.log('getAPI',dataToSave);
      
      console.log('discount',discount);

      for (const data of dataToSave){
        const CQListresponse = await axios.put(`${apiHost}/call_for_quotation_subcon_list/edit/${data.subconListId}`, 
        {
          discount : discount,

        }, { headers, });

        const Quoteresponse = await axios.put(`${apiHost}/quotation/edit/${data.quotationId}`, 
        {
          quote_rate: data.rate,

        }, { headers, });

        messageArray.push(Quoteresponse.data.message);
        
      }
      
      return messageArray;

    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
      
    }
  }
};

export default DescriptionController;

