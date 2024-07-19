import { axios, config } from "@/services";
import SubconModels from "@/models/SubconModels.js";
import { handleApiError } from "@/services/axios/handleApiError.js"; 

const SubconController = {
  async accessSubcon() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/subcon`, {
        headers,
      });

      const processedData = SubconModels.processResponseData(response.data);
      return processedData;

    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
    }
  },
  async addSubcon(subconData) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const response = await axios.post(
        `${apiHost}/subcon/add`,
        {
          name: subconData.name,
          reg_no: subconData.reg_no,
          gst_id: subconData.gst_id,
          address: subconData.address,
          phone_fex: subconData.phone_fex,
          phone: subconData.phone,
          contact_person: subconData.contact_person,
          email_1: subconData.email_1,
          email_2: subconData.email_2,
          email_3: subconData.email_3,
          short_code: subconData.short_code
        },
        { headers }
      );
      return response.data.message;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };

    }

  

  },
  async getDetailSubcon(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const response = await axios.get(`${apiHost}/subcon/${id}`, {
        headers,
      });
      return response.data.data;
      
    } catch (error) {
      const errorMessage = handleApiError(error);
    
      throw { errorMessage };
      
    }
  },
  async editSubc(id, updatedData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();

        const response = await axios.put(`${apiHost}/subcon/edit/${id}`, {
          name: updatedData.name,
          reg_no: updatedData.reg_no,
          gst_id: updatedData.gst_id,
          address: updatedData.address,
          phone_fex: updatedData.phone_fex,
          phone: updatedData.phone,
          contact_person: updatedData.contact_person,
          email_1: updatedData.email_1,
          email_2: updatedData.email_2,
          email_3: updatedData.email_3,
          short_code: updatedData.short_code
        }, { headers });
        return response.data.message;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw { errorMessage };
    }
  },
  async removeSubcon(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();

      const response = await axios.delete(`${apiHost}/subcon/remove/${id}`, {
        headers,
      });
      return response.data.message;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw { errorMessage };
    }
  },
};

export default SubconController;


