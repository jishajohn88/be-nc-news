const { getTopics, postTopics } = require("../controllers/topics.controllers");

const topicsRouter = require("express").Router();

topicsRouter.get('/',getTopics)
topicsRouter.post('/',postTopics)

module.exports = topicsRouter