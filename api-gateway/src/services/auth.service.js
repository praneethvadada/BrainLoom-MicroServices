const axios = require("axios");
const services = require("../config/services");

exports.getUserClaims = async (userId) => {
  const response = await axios.get(
    `${services.auth}/internal/claims/${userId}`,
    {
      headers: {
        // Must include this key — auth-service has gatewayGuard on /internal routes
        "x-internal-gateway-key": process.env.INTERNAL_GATEWAY_KEY
      }
    }
  );

  return response.data;
};