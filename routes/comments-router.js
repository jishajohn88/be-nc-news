const { deleteComments, getComments, postComments } = require("../controllers/comments.controllers");
const articlesRouter = require("./articles-router");

const commentsRouter = require("express").Router();

articlesRouter.get('/:article_id/comments',getComments)
articlesRouter.post('/:article_id/comments',postComments)
commentsRouter.delete('/:comment_id',deleteComments)
module.exports = commentsRouter