const db = require("../db/connection.js")
const { checkIfArticleExists } = require("../db/seeds/utils.js")


exports.selectArticles = (sort_by= 'created_at',order= 'desc') => {
    const validSortBys = ['article_id', 'title', 'topic', 'author','created_at','votes','article_img_url']
    const validOrders = ['asc','desc']

    if(!validSortBys.includes(sort_by)){
        return Promise.reject({status: 400, message: 'Invalid query'})
    }
    if(!validOrders.includes(order)){
        return Promise.reject({status: 400, message: 'Invalid query'})
    }
    return db.query (`SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`)
    .then((result)=> {
      //  console.log(result.rows,'<<in the model')
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