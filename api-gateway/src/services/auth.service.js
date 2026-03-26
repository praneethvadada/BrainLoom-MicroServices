const axios = require("axios");
const services = require("../config/services");

exports.getUserClaims = async (userId) => {

  const response = await axios.get(
    `${services.auth}/internal/claims/${userId}`
  );

  return response.data;
};