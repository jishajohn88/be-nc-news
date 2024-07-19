const { deleteComments, getComments, postComments, patchComment } = require("../controllers/comments.controllers");
const articlesRouter = require("./articles-router");

const commentsRouter = require("express").Router();

articlesRouter.get('/:article_id/comments',getComments)
articlesRouter.post('/:article_id/comments',postComments)
commentsRouter.delete('/:comment_id',deleteComments)
commentsRouter.patch('/:comment_id',patchComment)
module.exports = commentsRouter