const express = require('express')
const app = express();
const {getTopics} = require('../controllers/topics.controllers');
const { getArticleById, getArticles, patchArticles } = require('../controllers/articles.controllers');
const { getComments, postComments, deleteComments } = require('../controllers/comments.controllers');
const { getUsers } = require('../controllers/users.controllers');
const {  psqlErrorHandler,customErrorHandler,serverErrorHandler } = require('../error-handlers');

const { getEndpoints } = require('../controllers/endpoints.controllers');

app.use(express.json())

app.get('/api',getEndpoints)

app.get('/api/topics',getTopics)

app.get('/api/articles',getArticles)

app.get('/api/articles/:article_id',getArticleById)

app.patch('/api/articles/:article_id',patchArticles)

app.get('/api/articles/:article_id/comments',getComments)

app.post('/api/articles/:article_id/comments',postComments)

app.delete('/api/comments/:comment_id',deleteComments)

app.get('/api/users',getUsers)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)


app.all("*",(request,response,next) => {
    response.status(404).send({message: "Endpoint not found"})
  })
  
module.exports = app