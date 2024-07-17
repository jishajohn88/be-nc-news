const db = require("../db/connection.js")
const { checkIfArticleExists } = require("../db/seeds/utils.js")


exports.selectArticles = () => {
    return db.query ('SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC')
    .then((result)=> {
       return result.rows
    })
}
exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;',[article_id])
    .then((result)=> {
        if(result.rows.length === 0){
            return Promise.reject({status:404, message:"Article does not exist"})
        }
        return result.rows[0]
    })
}

exports.updatedArticle = (article_id,inc_votes) => {
    const promiseArray = []
    const queryValues = []
    let sqlString = `UPDATE articles SET votes = ` 
    // if(inc_votes){
    //     sqlString += `votes + $1`
    //     queryValues.push(inc_votes)
    // }
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