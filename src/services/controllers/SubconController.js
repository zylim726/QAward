import { axios, config } from "@/services";
import SubconModels from "@/models/SubconModels.js";

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
      const errorMessage = error.response.data.message;
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
          acc_code: subconData.acc_code,
          phone: subconData.phone,
          contact_person: subconData.contact_person,
          email: subconData.email,
          short_code: subconData.short_code
        },
        { headers }
      );
      return response.data.message;
    } catch (error) {
      const errorMessage = error.response.data.message;
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
      const errorMessage = error.response.data.message;
    
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
          acc_code: updatedData.acc_code,
          phone: updatedData.phone,
          contact_person: updatedData.contact_person,
          email: updatedData.email,
          short_code: updatedData.short_code
        }, { headers });
        return response.data.message;
    } catch (error) {
        const errorMessage = error.response.data.message;
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
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
  // async updatePermission(permission, module, accesslevel) {
  //   try {
  //     const apiHost = config.getHost();
  //     const headers = config.getHeadersWithToken();
  
  //     const response = await axios.get(`${apiHost}/access_permission`, {
  //       headers,
  //     });
  
  //     const responseData = response.data;
  //     let message;
  
  //     if (responseData && responseData.data && Array.isArray(responseData.data)) {
  //       const dataArray = responseData.data;
  //       const promises = [];
  
  //       const permissionExists = dataArray.some(item => {
  //         return item.access_level === accesslevel && item.permission === permission && item.module === module;
  //       });
  
  //       if (permissionExists) {
  //         promises.push(
  //           axios.delete(`${apiHost}/access_permission/remove/${accesslevel}/${permission}`, { headers })
  //         );
  //       } else {
  //         // If permission does not exist, add it
  //         promises.push(
  //           axios.post(`${apiHost}/access_permission/add`, {
  //             access_level: accesslevel,
  //             module: module,
  //             permission: permission,
  //           }, { headers })
  //         );
  //       }
  
  //       const results = await Promise.all(promises);
  
  //       results.forEach(result => {
  //         message = result.data.message;
  //         console.log(message);
  //       });
  //     }
  
  //     return message;
  //   } catch (error) {
  //     console.error('Error updating permission:', error);
  //     throw { errorMessage: 'An error occurred while updating permission.' };
  //   }
  // }
};

export default SubconController;


