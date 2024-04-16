import { axios, config } from "@/services";
import CallQuotationModels from "@/models/CallQuotationModels.js";

const CallofQuotationController = {
  async accessCQ() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/call_for_quotation`, {
        headers,
      });

      const processedData = CallQuotationModels.processResponseData(response.data);
    
      return processedData;

      
    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
      
    }
  },
  async removeCQ(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();

      const response = await axios.delete(`${apiHost}/call_for_quotation/remove/${id}`, {
        headers,
      });
      return response.data.message;
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
  async getDetailCQ(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const response = await axios.get(`${apiHost}/call_for_quotation/${id}`, {
        headers,
      });
      return response.data.data;
      
    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
      
    }
  },
  async editCQ(id, updatedData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();

        const response = await axios.put(`${apiHost}/call_for_quotation/edit/${id}`, {
          trade_category: updatedData.tradeCategory, 
          trade: updatedData.trade, 
          trade_location1: updatedData.location, 
          actual_calling_quotation_date: updatedData.CallingQuotationDate, 
          awading_target_date: updatedData.awadingtargetdate, 
          remarks: updatedData.remarks
        }, { headers });

        return response.data.message;
    } catch (error) {
        const errorMessage = error.response.data.message;
        throw { errorMessage };
    }
  },
  async getCQ() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const projectId = localStorage.getItem('projectId');
      const response = await axios.get(`${apiHost}/call_for_quotation/showByProject/${projectId}`, {
        headers,
      });

      console.log('response',response.data);

      const processedData = CallQuotationModels.processResponseData(response.data);
      return processedData;
    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
      
    }
  },
  async addCQ(selectedFormData, transformedCQImport) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const combinedCQData = [...selectedFormData, ...transformedCQImport];
      const projectId = localStorage.getItem('projectId');
      const messages = [];
  
      for (const formData of combinedCQData) {
        const cqResponse = await axios.post(`${apiHost}/call_for_quotation/add`, {
          trade_category: formData.tradeCategory,
          trade: formData.trade,
          trade_location1: formData.location,
          actual_calling_quotation_date: formData.CallingQuotationDate,
          awading_target_date: formData.awadingtaget,
          remarks: formData.remarks,
          status: 'Pending',
          project_id: projectId
        }, {
          headers,
        });
        messages.push(cqResponse.data.message);
      }

      return messages;
  
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
  async addUnit(ids, selectedUnit) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        let latestMessage = ''; 
        
        for (const innerRow of selectedUnit) {
          for (const object of innerRow) {
            for (const id of ids) {
                try {
                    const cqResponse = await axios.post(`${apiHost}/cq_unit_type/add`, {
                        type: object.name,
                        adj_factor: object.adjFactor,
                        quantity: object.quantity,
                        call_for_quotation_id: id 
                    }, {
                        headers,
                    });
                    
                    latestMessage = cqResponse.data.message;
                } catch (error) {
                    const errorMessage = error.response.data.message;
                    throw errorMessage;
                }
            }
          }
        }

        return latestMessage; 
    } catch (error) {
        const errorMessage = error.response.data.message;
        throw errorMessage; 
    }
  },
};

export default CallofQuotationController;

