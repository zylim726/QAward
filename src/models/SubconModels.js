const SubconModels = {
  processResponseData(response) {
    const dataArray = response.data;

    const processedData = dataArray.map((config) => ({
      id: config.id,
      name: config.name, 
      updatedAt: config.updatedAt,
      reg_no: config.reg_no,
      gst_id: config.gst_id,
      address: config.address,
      acc_code: config.acc_code,
      phone: config.phone,
      contact_person: config.contact_person,
      email: config.email,
      short_code: config.short_code
    }));

    return processedData;
  },
};

export default SubconModels;

