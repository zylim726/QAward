const ProjectModels = {
  processResponseData(response) {
    const dataArray = response.data;

    const processedData = dataArray.map((project) => {
      if (project.Dept) {
        return {
          title: project.name,
          id: project.Dept.id,  
          code: project.Dept.code,  
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

export default ProjectModels;
