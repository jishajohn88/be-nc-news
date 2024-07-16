const { selectComments } = require("../models/comments.models")

exports.getComments = (request,response,next) => {
    const {article_id} = request.params
    selectComments(article_id).then((comments) =>{
        response.status(200).send({comments})
    }).catch((err)=>{
        next(err)
    })
}