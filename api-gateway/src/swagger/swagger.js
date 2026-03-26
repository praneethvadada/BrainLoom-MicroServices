const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BrainLoom API Gateway",
      version: "1.0.0",
      description: "Central API Gateway for all BrainLoom services"
    },
    servers: [
      {
        url: "http://localhost:4000"
      }
    ],
    tags: [
      {
        name: "Gateway",
        description: "Gateway health and status"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;