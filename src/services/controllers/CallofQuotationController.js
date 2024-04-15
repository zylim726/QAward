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
  async getCQ(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/call_for_quotation/${id}`, {
        headers,
      });

      const processedData = CallQuotationModels.processResponseData(response.data);
      return processedData;
      
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
  async addUnit(parentFormData, transformedCQImport, selectedUnit, transformedImportUnit) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const combinedCQData = [...parentFormData, ...transformedCQImport];
      const combinedUnitData = [...selectedUnit, ...transformedImportUnit];
      const projectId = localStorage.getItem('projectId');

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
        const cqId = cqResponse.data.data.id;

        const unitRequests = [];
        for (const unitData of combinedUnitData) {
          const unitRequest = axios.post(`${apiHost}/cq_unit_type/add`, {
            type: unitData.type,
            adj_factor: unitData.adjFactor,
            quantity: unitData.quantity,
            call_for_quotation_id: cqId,
          }, { headers });

          unitRequests.push(unitRequest);
        }
        
        await Promise.all(unitRequests);
        const unitResponses = await Promise.all(unitRequests);

        const UpdateMessage = unitResponses.map(response => response.data.message);
        return UpdateMessage.join(', ');

      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
      
    }
  },
};

export default CallofQuotationController;

