const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gourmet Delivery API',
      version: '1.0.0',
      description: 'Express API for authentication, restaurants, menu, and orders',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Restaurants', description: 'Restaurants browsing' },
      { name: 'Menu', description: 'Menu items' },
      { name: 'Orders', description: 'Order creation and tracking' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
