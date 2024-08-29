import { axios, config } from "@/services";
import { handleApiError } from "@/services/axios/handleApiError.js"; 


const NotificationController = {
  async notificationAccess() {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const response = await axios.get(`${apiHost}/notification/showBySystemUserId`, { headers });

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },
  async updateRead(NotificationRead) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const messages = [];
      for (const id of NotificationRead.ids) {

        const response = await axios.patch(`${apiHost}/notification/edit/${id}`, { 
          is_read: 1, 
        }, { headers });
        messages.push(response.data.message);
  
      }
      
      return messages;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },
  async updateUnRead(NotificationUnread) {
    try {
      const apiHost = config.getHost();
      const headers = config.getHeadersWithToken();
      const messages = [];
      for (const id of NotificationUnread.ids) {

        const response = await axios.patch(`${apiHost}/notification/edit/${id}`, { 
          is_read: 0, 
        }, { headers });
        messages.push(response.data.message);
  
      }
      
      return messages;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },
};


export default NotificationController;
