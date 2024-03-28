const ProjectModels = {
    processResponseData(response) {
      const dataArray = response.data;
  
      // Map over the filtered data to transform it
      const processedData = dataArray.map((project) => ({
        title: project.name,
      }));
      return processedData;
    },
  };
  
  export default ProjectModels;
  