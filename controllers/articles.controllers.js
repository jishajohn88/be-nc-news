const { selectArticleById, selectArticles, updatedArticle, insertArticle } = require("../models/articles.models")


exports.getArticles = (request,response,next) => {
    const {sort_by,order,topic,p,limit}=request.query
    selectArticles(sort_by,order,topic,p,limit).then((articles)=>{
        response.status(200).send({articles:articles[0],total_count:articles[1]})
    }).catch((err) => {
        next(err)
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

exports.postArticle = (request,response,next) => {
    const newArticle = request.body
    insertArticle(newArticle).then((article) => {
        response.status(201).send({article})
    }).catch((err)=>{
        next(err)
    })
}