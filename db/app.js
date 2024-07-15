const express = require('express')
const app = express();
const {getTopics} = require('../controllers/topics.controllers');
const {  psqlErrorHandler,customErrorHandler,serverErrorHandler } = require('../error-handlers');
const endpoints = require('../endpoints.json')
const fs = require('fs/promises');

app.get('/api',(request,response,next)=>{
    const path = './endpoints.json'
    fs.readFile(path,'utf-8')
    .then((result)=>{
        const parsedData = JSON.parse(result)
        response.status(200).send({endpoints:parsedData})
    })
    
})
app.get('/api/topics',getTopics)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)


app.all("*",(request,response,next) => {
    response.status(400).send({message: "Path not found"})
  })
  
module.exports = app