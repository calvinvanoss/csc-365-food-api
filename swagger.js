const swaggerAutogen = require("swagger-autogen")({openapi: "3.0.0"});

const doc = {
  info: {
    title: "Recipe API",
  },
 servers: [
    {
      url: process.env.RENDER_EXTERNAL_URL || "http://localhost:3000",
    },
 ]
};

const outputFile = "./swagger.json";
const routes = ["./src/app.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
