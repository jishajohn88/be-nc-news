const db = require("../db/connection.js")
const { checkIfArticleExists, checkIfTopicExists } = require("../db/seeds/utils.js")
const { selectTopics } = require("./topics.models.js")


exports.selectArticles = (sort_by= 'created_at',order= 'desc',topic) => {
    const validSortBys = ['article_id', 'title', 'topic', 'author','created_at','votes','article_img_url']
    const validOrders = ['asc','desc']
  
    let sqlString = `SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id `
    const queryValues = []
    const promiseArray = []
    
    if(!validSortBys.includes(sort_by)){
        return Promise.reject({status: 400, message: 'Invalid endpoint'})
    } 
   
    if(!validOrders.includes(order)){
        return Promise.reject({status: 400, message: 'Invalid endpoint'})
    } 
   if(topic) {
        sqlString += ` WHERE topic=$1 `
        queryValues.push(topic)
        promiseArray.push(checkIfTopicExists(topic))
    }
     sqlString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
   
    promiseArray.push(db.query(sqlString,queryValues))
    return Promise.all(promiseArray).then((result)=>{
        const queryResultsWithArticles = result[0]
        const topicResults = result[1]
        if(queryResultsWithArticles === true && topicResults.rows.length >= 0){
             return topicResults.rows
        }
       return queryResultsWithArticles.rows
    })
}

exports.selectArticleById = (article_id) => {
    let sqlString = `SELECT articles.*,COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `

    const queryValues = []
    const promiseArray = []
    if(article_id){
        sqlString += `WHERE articles.article_id=$1 `
        queryValues.push(article_id)
        promiseArray.push(checkIfArticleExists(article_id))
    }
    sqlString += `GROUP BY articles.article_id`
    promiseArray.push(db.query(sqlString,queryValues))

    return Promise.all(promiseArray).then((result) => {
        const queryResults = result[0]
        const articleResults = result [1]
        if(queryResults === false && articleResults.rows.length === 0){
            return Promise.reject({status:404,message:'Article not found'})
        }
        return articleResults.rows[0];
    })
}

exports.updatedArticle = (article_id,inc_votes) => {
    const promiseArray = []
    const queryValues = []
    let sqlString = `UPDATE articles SET votes = ` 
    
      if(inc_votes && article_id){
        sqlString+= `votes + $1 WHERE article_id = $2 RETURNING *;`
        queryValues.push(inc_votes)
        queryValues.push(article_id)
        promiseArray.push(checkIfArticleExists(article_id))
    }
    promiseArray.push(db.query(sqlString,queryValues))
    return Promise.all(promiseArray).then((result)=>{
        const queryResults = result[0]
        const articleResults = result[1]
        if(queryResults === false && articleResults.rows.length === 0){
            return Promise.reject({status:404,message:'Not found'})
        }
        return articleResults.rows[0]
    })
}