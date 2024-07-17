const fs = require('fs/promises');

exports.getEndpoints = (request,response,next) => {
    const path = './endpoints.json'
    fs.readFile(path,'utf-8')
    .then((result)=>{
        const parsedData = JSON.parse(result)
        response.status(200).send({endpoints:parsedData})
    })
}