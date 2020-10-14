'use strict'
//This file is AWS Lambda entry point

const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app.js');
const server = awsServerlessExpress.createServer(app)

module.exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);