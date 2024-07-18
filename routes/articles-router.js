const { getArticles, getArticleById, patchArticles } = require('../controllers/articles.controllers');

const articlesRouter = require('express').Router();

articlesRouter.get('/',getArticles)
articlesRouter.get('/:article_id',getArticleById)
articlesRouter.patch('/:article_id',patchArticles)

module.exports = articlesRouter