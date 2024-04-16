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
  async addSubcon(name) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();

      const response = await axios.post(
        `${apiHost}/subcon/add`,
        {
          name: name,
        },
        { headers }
      );
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


