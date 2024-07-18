const db = require("../db/connection")
const { checkIfArticleExists, checkIfCommentExists } = require("../db/seeds/utils")

exports.selectComments = (article_id) => {

    const queryValues = []
    const promiseArray = []
    let sqlString = `SELECT * FROM comments `
    if(article_id){
        sqlString+= `WHERE article_id=$1 `
        queryValues.push(article_id)
        promiseArray.push(checkIfArticleExists(article_id))
    }

    sqlString += `ORDER BY created_at DESC`
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
    return db.query(`DELETE FROM comments WHERE comment_id=$1`,[comment_id])
}