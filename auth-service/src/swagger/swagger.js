const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Microservice API",
      version: "1.0.0",
      description: "Auth Service APIs"
    },
    servers: [
      {
        url: "http://localhost:4001/api/v1/auth"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs
};
