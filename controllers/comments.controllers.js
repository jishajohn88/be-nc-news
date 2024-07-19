const { selectComments, insertComment, removeComment, updatedComment } = require("../models/comments.models")

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

exports.deleteComments = (request,response,next) => {
    const {comment_id} = request.params
    removeComment(comment_id).then(() =>{
        response.status(204).send()
    }).catch((err) => {
        next(err)
    })
}

exports.patchComment = (request,response,next) => {
    const {comment_id} = request.params
    const {inc_votes} = request.body
    updatedComment(comment_id,inc_votes).then((updatedComment)=> {
        response.status(200).send({comment : updatedComment})
    }).catch((err) => {
        next(err)
    })
}