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
  async addCQ(selectedFormDataList, selectedImportedData) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const projectId = localStorage.getItem('projectId');

      const combinedData = [...selectedFormDataList, ...selectedImportedData];

      for (const data of combinedData) {
        const response = await axios.post(`${apiHost}/call_for_quotation/add`, {
          trade_category: data.tradeCategory,
          trade: data.trade,
          trade_location1: data.location,
          actual_calling_quotation_date: data.CallingQuotationDate,
          awading_target_date: data.awadingtaget,
          remarks: data.remarks,
          status: 'Pending',
          project_id: projectId
        }, {
          headers,
        });

        return response.data.message;
      }
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
  async addUnit(selectedFormDataList, selectedImportedData) {
    try {
      console.log('CheckAPI',selectedFormDataList,selectedImportedData)
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const combinedData = [...selectedFormDataList, ...selectedImportedData];

      for (const data of combinedData) {
        const response = await axios.post(`${apiHost}/cq_unit_type/add`, {
          type: data.type,
          adj_factor: data.adjFactor,
          quantity: data.quantity,
          call_for_quotation: data.CallingQuotationDate,
        }, {
          headers,
        });

        return response.data.message;
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
      
    }
  },
};

export default CallofQuotationController;

