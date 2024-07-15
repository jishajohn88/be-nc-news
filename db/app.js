const express = require('express')
const app = express();
const {getTopics} = require('../controllers/topics.controllers');
const { customErrorHandler, serverErrorHandler } = require('../error-handlers');

app.get('/api/topics',getTopics)

app.all("*",(request,response,next) => {
    response.status(400).send({message: "Path not found"})
  })
  

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app