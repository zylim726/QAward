import { axios, config } from "@/services";
import ProjectModels from "@/models/ProjectModels.js";
import getProjectModels from "@/models/getProjectModels.js";

const ProjectController = {
  async projectList() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const response = await axios.get(`${apiHost}/sitelist`, { headers });

      const processedData = ProjectModels.processResponseData(response.data);
      return {
        data: processedData,
        message: null, 
      };
    } catch (error) {
      let errorMessage;

      if (error.response && error.response.status === 403) {
        errorMessage = error.response.data.message;
      } 

      return {
        data: null,
        message: errorMessage,
      };
    }
  },
  async projectcontrol(formData) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const adminIds = formData.admins;
      const messages = [];
      
      for (const adminId of adminIds) {

        if (adminId.id === 0) {
            const response = await axios.post(`${apiHost}/project_approval/add`, {
              project_id: formData.projectId,
              system_user_id: adminId.system_user_id 
            }, { headers });
            messages.push(response.data.message);
        }else {
            const response = await axios.put(`${apiHost}/project_approval/edit/${adminId.id}`, {
              project_id: formData.projectId,
              system_user_id: adminId.system_user_id 
            }, { headers });
            messages.push(response.data.message);

        }
      }
      return messages;
    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
    }
  },
  async getProjectData(projectDt) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const ids = projectDt.id;
      const response = await axios.get(`${apiHost}/project_approval/showByProject/${ids}`, { headers });
;
      return response.data;
    } catch (error) {
      let errorMessage;

      if (error.response && error.response.status === 403) {
        errorMessage = error.response.data.message;
      } 

      return {
        data: null,
        message: errorMessage,
      };
    }
  },
  async deleteProjectControl(deleteId) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const response = await axios.delete(`${apiHost}/project_approval/remove/${deleteId}`, { headers });
      return response.data.message;
    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
    }
  },
  async accessProject() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 

      const response = await axios.get(`${apiHost}/sitelist`, {
        headers,
      });

      const processedData = getProjectModels.processResponseData(response.data);
      return processedData;

    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
  async addProject(subconData) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const messages = [];
      const QRresponse = await axios.post(
        `${apiHost}/project/add`,
        {
          name: subconData.name,
          regno: subconData.regno,
          code: subconData.code,
          area: subconData.area,
        },
        { headers }
      );

      for (let unitType of subconData.unitTypes) {
        const response = await axios.post(
          `${apiHost}/project_unit_type/add`,
          {
            unit_type: unitType.unit_type,
            quantity: unitType.quantity,
            adj_factor: unitType.adj_factor,
            project_id: QRresponse.data.data.id,
          },
          { headers }
        );
        messages.push(response.data.message);
      }

      return messages;
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };

    }
  },
  async getDetailProject(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const response = await axios.get(`${apiHost}/project/${id}`, {
        headers,
      });
      return response.data.data;
      
    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
      
    }
  },
  async getUnitTypes(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken(); 
      const response = await axios.get(`${apiHost}/project_unit_type/showByProject/${id}`, {
        headers,
      });

      return response.data.data;
      
    } catch (error) {
      const errorMessage = error.response.data.message;
    
      throw { errorMessage };
      
    }
  },
  async editProjs(id, updatedData) {
    try {
        const apiHost = config.getHost();
        const headers = config.getHeadersWithToken();
        const messages = [];

        for (let unitType of updatedData.unitTypes) {
          if (unitType.id) {
            const unitResponse = await axios.put(
              `${apiHost}/project_unit_type/edit/${unitType.id}`,
              {
                unit_type: unitType.unit_type,
                quantity: unitType.quantity,
                adj_factor: unitType.adj_factor,
              },
              { headers }
            );
            messages.push(unitResponse.data.message);
          } else {
          
            const unitResponse = await axios.post(
              `${apiHost}/project_unit_type/add`,
              {
                unit_type: unitType.unit_type,
                quantity: unitType.quantity,
                adj_factor: unitType.adj_factor,
                project_id: id
              },
              { headers }
            );
            messages.push(unitResponse.data.message);
          }
        }

        return messages;
    } catch (error) {
        const errorMessage = error.response.data.message;
        throw { errorMessage };
    }
  },
  async removeProject(id) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const UnitResponse = await axios.delete(`${apiHost}/project_unit_type/remove/${id}`, {
        headers,
      });

      return UnitResponse.data.message;
    } catch (error) {
      const errorMessage = error.response.data.message;
      throw { errorMessage };
    }
  },
};


export default ProjectController;
