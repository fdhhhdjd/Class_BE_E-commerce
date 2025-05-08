const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Dự án Node.js chuẩn chỉ với Express và Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: [
    path.resolve(__dirname, "../../v1/routes/**/*.js"),
    path.resolve(__dirname, "../../v1/controllers/**/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
