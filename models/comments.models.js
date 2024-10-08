const db = require("../db/connection")
const { checkIfArticleExists, checkIfCommentExists } = require("../db/seeds/utils")

exports.selectComments = (article_id,limit=10,p=1) => {

    const queryValues = []
    const promiseArray = []
    let sqlString = `SELECT * FROM comments `
    if(article_id){
        sqlString+= `WHERE article_id=$1 `
        queryValues.push(article_id)
        promiseArray.push(checkIfArticleExists(article_id))
    }

    sqlString += `ORDER BY created_at DESC LIMIT ${limit} OFFSET ${(p-1) * limit}`
    promiseArray.push(db.query(sqlString,queryValues));

    return Promise.all(promiseArray).then((result) => {
        const queryResults = result[0]
        const articleResults = result[1]
        if(queryResults === false && articleResults.rows.length === 0){
            return Promise.reject({status:404,message:'Not found'})
        }

        return articleResults.rows;
    })
}

exports.insertComment = ({username,body},article_id) => {
    const promiseArray = []
    if(article_id){
        promiseArray.push(checkIfArticleExists(article_id))
    }
    promiseArray.push(db.query(`INSERT INTO comments (body, article_id, author)
        VALUES ($1, $2, $3) RETURNING *;`,[body,article_id,username]))

    return Promise.all(promiseArray).then((result) => {
        const queryResults = result[0]
        const articleResults = result[1]
        if(queryResults === false && articleResults.rows.length === 0){
            return Promise.reject({status:404,message:'Not found'})
        }
        return articleResults.rows[0];
    })
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *;`,[comment_id])
    .then((result)=>{
        return result.rows
    })
}

exports.updatedComment = (comment_id,inc_votes) => {
    const promiseArray = []
    const queryValues = []
    let sqlString = `UPDATE comments SET votes = `
    if(inc_votes && comment_id){
        sqlString += `votes + $1 WHERE comment_id = $2 RETURNING *;`
        queryValues.push(inc_votes)
        queryValues.push(comment_id)
        promiseArray.push(checkIfCommentExists(comment_id))
    }
    promiseArray.push(db.query(sqlString,queryValues))
    return Promise.all(promiseArray).then((result) => {
        const queryResults = result[0]
        const commentResults = result[1]
        if(queryResults === false && commentResults.rows.length === 0){
            return Promise.reject({status:404,message: 'Not found'})
        }
        return commentResults.rows[0]
    })
}