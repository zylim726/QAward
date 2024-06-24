const getProjectModels = {
  processResponseData(response) {
    const dataArray = response.data;

    const processedData = dataArray.map((project) => {
      if (project.Dept) {
        return {
          name: project.name,
          id: project.Dept.id,  
          code: project.Dept.code,  
          area: project.Dept.area,
          billto: project.Dept.billto,
          ksk_id_area: project.Dept.ksk_id_area,
          regno: project.Dept.regno
        };
      } else {
        return {
          data: null
        };
      }
    });
    return processedData;
  },
};

export default getProjectModels;
