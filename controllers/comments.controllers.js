const { selectComments, insertComment } = require("../models/comments.models")

exports.getComments = (request,response,next) => {
    const {article_id} = request.params
    selectComments(article_id).then((comments) =>{
        response.status(200).send({comments})
    }).catch((err)=>{
        next(err)
    })
}

exports.postComments = (request,response,next) => {
    const newComment = request.body
    const {article_id} = request.params
    insertComment(newComment,article_id).then((comment) => {
        response.status(201).send({comment})
    }).catch((err) => {
        next(err)
    })
}