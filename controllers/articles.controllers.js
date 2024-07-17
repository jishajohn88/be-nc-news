const { response } = require("../db/app")
const { selectArticleById, selectArticles, updatedArticle } = require("../models/articles.models")


exports.getArticles = (request,response,next) => {
    selectArticles().then((articles)=>{
        response.status(200).send({articles})
    })
}
exports.getArticleById = (request,response,next) => {
    const {article_id} = request.params
    selectArticleById(article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.patchArticles = (request,response,next) => {
    const {article_id} = request.params
    const {inc_votes} =request.body
    updatedArticle(article_id,inc_votes).then((article) =>{
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}