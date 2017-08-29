'use strict';
require('app-module-path').addPath(__dirname + '/api');

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();
var SwaggerUI = require('swagger-tools/middleware/swagger-ui');
var cors = require('cors');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  var optionui={
    apiDocs:'/api/api-docs',
  	swaggerUi:'/api/docs'
  }
  app.use(cors());
  app.use(SwaggerUI( swaggerExpress.runner.swagger,optionui));


  // install middleware
  swaggerExpress.register(app);

  var server_port = process.env.LISTEN_PORT || 8080
  var server_ip_address = process.env.LISTEN_IP || '0.0.0.0'
  app.listen(server_port, server_ip_address, function () {
	 console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
  });
  
});