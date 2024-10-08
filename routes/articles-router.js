const { getArticles, getArticleById, patchArticles, postArticle, deleteArticle } = require('../controllers/articles.controllers');

const articlesRouter = require('express').Router();

articlesRouter.get('/',getArticles)
articlesRouter.post('/',postArticle)
articlesRouter.get('/:article_id',getArticleById)
articlesRouter.patch('/:article_id',patchArticles)
articlesRouter.delete('/:article_id',deleteArticle)

module.exports = articlesRouter