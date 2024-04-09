import { axios, config } from "@/services";

export async function checkAccess() {
  try {
    const apiHost = config.getHost();
    const headers = config.getHeadersWithToken();
    const accesslevel = localStorage.getItem('accesslevel');

    const response = await axios.get(`${apiHost}/access_permission/${accesslevel}`, {
      headers,
    });

    const processData = response.data.data;
    if (Array.isArray(processData)) {
        const permissions = processData.map((data) => {
            return data.permission;
        });
        return permissions;
    } else {
        return processData.data.message;
    }
    
  } catch (error) {
    console.error('Error checking access:', error);
    throw error;
  }
}
