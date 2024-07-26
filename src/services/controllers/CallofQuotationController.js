import { axios, config } from "@/services";
import CallQuotationModels from "@/models/CallQuotationModels.js";
import ApproveCQModels from "@/models/ApproveCQModels.js";
import UnittypeModels from "@/models/UnittypeModels.js";
import { handleApiError } from "@/services/axios/handleApiError.js"; 

const CallofQuotationController = {
  async accessCQ() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/call_for_quotation`, {
        headers,
      })

      const processedData = CallQuotationModels.processResponseData(response.data);

      return processedData;

      
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
  async accessCQApprove() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/call_for_quotation`, {
        headers,
      })

      const processedData = ApproveCQModels.processResponseData(response.data);

      return processedData;

      
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
  async removeCQ(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();

      const getCQResponse = await axios.delete(`${apiHost}/cq_unit_type/removeByCallForQuotation/${id}`, {
        headers,
      });

      return getCQResponse.data.message;
    } catch (error) {
      const errorMessage = handleApiError(error);
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
      const errorMessage = handleApiError(error);
    
      throw { errorMessage };
      
    }
  },
  async editCQ(id, updatedData, updatedUnit) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        
        const [unitResponse, cfqResponse] = await Promise.all([
          axios.put(`${apiHost}/cq_unit_type/edit/${updatedUnit.id}`, {
            type: updatedUnit.type, 
            quantity: updatedUnit.quantity, 
          }, { headers }),
          axios.put(`${apiHost}/call_for_quotation/edit/${id}`, {
            trade_category: updatedData.trade_category, 
            trade: updatedData.trade, 
            trade_location1: updatedData.trade_location1, 
            actual_calling_quotation_date: updatedData.actual_calling_quotation_date, 
            awading_target_date: updatedData.awading_target_date, 
            remarks: updatedData.remarks
          }, { headers })
        ]);

        let combinedMessage = `${unitResponse.data.message} ${cfqResponse.data.message}`;
        const uniqueMessages = new Set(combinedMessage.split(' '));
        combinedMessage = Array.from(uniqueMessages).join(' ');
        return combinedMessage;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw { errorMessage };
    }
  },
  async getCQ() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const projectId = localStorage.getItem('projectId');
      const response = await axios.get(`${apiHost}/call_for_quotation/noUnitType/${projectId}`, {
        headers,
      });

      const processedData = CallQuotationModels.processResponseData(response.data);
      return processedData;
    } catch (error) {
      const errorMessage = handleApiError(error);
    
      throw { errorMessage };
      
    }
  },
  async getUTypes() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const projectId = localStorage.getItem('projectId');
      const response = await axios.get(`${apiHost}/project_unit_type/showByProject/${projectId}`, {
        headers,
      });

      return response.data.data;

    } catch (error) {
      const errorMessage = handleApiError(error);
    
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
          actual_calling_quotation_date: formData.callingquotationDate,
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
      const errorMessage = handleApiError(error);
      throw { errorMessage };
    }
  },
  async addUnit(callIds, selectedUnitTypes) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        let latestMessage = ''; 
        
        for (const object of selectedUnitTypes) {
          for (const id of callIds) {
              try {
                  const cqResponse = await axios.post(`${apiHost}/cq_unit_type/add`, {
                      type: object.unit_type,
                      adj_factor: object.adj_factor,
                      quantity: object.quantity,
                      call_for_quotation_id: id 
                  }, {
                      headers,
                  });
                  latestMessage = cqResponse.data.message;
              } catch (error) {
                  const errorMessage = handleApiError(error);
                  throw errorMessage;
              }
          }
        }

        return latestMessage; 
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage; 
    }
  },
  async comparisonAddCQunit(cqId, selectedUnitTypes) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        let latestMessage = ''; 
        
        for (const object of selectedUnitTypes) {
          try {
              const cqResponse = await axios.post(`${apiHost}/cq_unit_type/add`, {
                  type: object.unit_type,
                  adj_factor: object.adj_factor,
                  quantity: object.quantity,
                  call_for_quotation_id: cqId 
              }, {
                  headers,
              });
              latestMessage = cqResponse.data.message;
          } catch (error) {
              const errorMessage = handleApiError(error);
              throw errorMessage;
          }
        }

        return latestMessage; 
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw errorMessage; 
    }
  },
  async getUnittype(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const response = await axios.get(`${apiHost}/cq_unit_type/showByCallForQuotation/${id}`, {
        headers,
      });
       const processedData = UnittypeModels.processResponseData(response.data);

       return processedData;
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
      
    }
  },
};

export default CallofQuotationController;

