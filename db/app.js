const express = require('express')
const app = express();
const {getTopics} = require('../controllers/topics.controllers');
const { getArticleById, getArticles } = require('../controllers/articles.controllers');
const { getComments } = require('../controllers/comments.controllers');
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

app.get('/api/articles',getArticles)

app.get('/api/articles/:article_id',getArticleById)

app.get('/api/articles/:article_id/comments',getComments)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)


app.all("*",(request,response,next) => {
    response.status(400).send({message: "Path not found"})
  })
  
module.exports = app