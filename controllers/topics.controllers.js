const {selectTopics, insertTopic} = require('../models/topics.models')

exports.getTopics = (request,response,next) =>{
    selectTopics().then((topics) => {
        response.status(200).send({topics})
    }).catch((err)=>{
        next(err)
    })
}

exports.postTopics = (request,response,next) => {
    const newTopic = request.body
    insertTopic(newTopic).then((topic) => {
        response.status(201).send({topic})
    }).catch((err)=>{
        next(err)
    })
}