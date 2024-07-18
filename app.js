const express = require('express')
const app = express();
const {  psqlErrorHandler,customErrorHandler,serverErrorHandler } = require('./error-handlers');
const apiRouter = require("./routes/api-router")

app.use(express.json())

app.use("/api",apiRouter)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

app.all("*",(request,response,next) => {
    response.status(404).send({message: "Endpoint not found"})
  })
  
module.exports = app