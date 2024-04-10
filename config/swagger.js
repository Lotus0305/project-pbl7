const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'A simple Express API',
    },
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const specs = swaggerJsDoc(options);

module.exports = specs;