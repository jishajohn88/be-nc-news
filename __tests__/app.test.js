const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const request = require("supertest")
const db = require('../db/connection.js')
const endpoints = require('../endpoints.json')
const app = require('../app.js')
const { checkIfCommentExists } = require('../db/seeds/utils.js')


beforeEach(() => {
   return seed(data)
})

afterAll(()=> {
    return db.end()
})

describe("GET /api",() => {
    test("responds with a json detailing all the available endpoints", () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})
describe("GET /api/topics",() => {
    test("GET:200 responds with an array of topics", () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
           expect(body.topics.length).toBeGreaterThan(0)
           body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string')
            expect(typeof topic.description).toBe('string')
           })
        })
    })
    test("GET: 404 send an appropriate status and error message when given an invalid endpoint", () => {
        return request(app)
        .get('/api/invalid')
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe("Endpoint not found")
        })
    })
})

describe("GET /api/articles",() => {

    test("GET: 200 sends an array of article objects",()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBeGreaterThan(0)
            expect(body.articles[0]).toMatchObject({
                "author": 'icellusedkars',
                "title": 'Eight pug gifs that remind me of mitch',
                "article_id": 3,
            })
        })
    })
    test("GET: 200 sends an array of article objects sorted in descending order for date",() => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
           expect(response.body.articles.length).toBeGreaterThan(0)
           expect(response.body.articles).toBeSortedBy("created_at",{descending:true})
        })
    })
    test("GET: 200 sends an array of article objects with no body property present in each object",() => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBeGreaterThan(0)
            body.articles.forEach((article) => {
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test("GET: 200 responds with the data ordered by the given sort_by query column name", () => {
        return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBeGreaterThan(0)
            expect(body.articles).toBeSortedBy('votes',{descending : true})
        })
    })
    test("GET: 400 responds with an appropriate error message when passed an invalid endpoint" ,() => {
        return request(app)
        .get('/api/articles?sort_by=invalid-query')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Invalid endpoint')
        })
    })
    test("GET:200 responds with the data ordered by the given order query column name", () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBeGreaterThan(0)
            expect(body.articles).toBeSorted()
        })
    })
    test("GET: 400 responds with the appropriate error message when passed with an invalid value for the order query",() => {
        return request(app)
        .get('/api/articles?order=invalid')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Invalid endpoint')
        })
    })
    test("GET: 200 responds with the article objects filtered by topic query",() => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBeGreaterThan(0)
            expect(body.articles[0]).toMatchObject({
                author: 'icellusedkars',
                title: 'Eight pug gifs that remind me of mitch',
                article_id: 3,
                topic: 'mitch',
            })
            body.articles.forEach((article) => {
                expect(article.topic).toBe('mitch')
            })
        })
    })
    test("GET: 404 responds with all the articles objects when there invalid topic query passed",() => {
        return request(app)
        .get('/api/articles?topic=invalid')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Topic not found')
           
        })
    })
    test("GET: 200 responds with the appropriate error message when the topic does not exist",() => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual([])
        })
    })
    test("GET: 200 responds with the first 10 articles",() => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(10)
        })
    })
    test("GET: 200 responds with limited number of articles passed as query",() => {
        return request(app)
        .get('/api/articles?limit=3')
        .expect(200)
        .then(({body})=>{
            expect(body.articles.length).toBe(3)
        })
    })
    test("GET: 400 responds with the appropriate error message when invalid is passed into the limit query",() => {
        return request(app)
        .get('/api/articles?limit=invalid')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request')
        })
    })
    test("GET: 200 responds with the first page",() => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(10)
            body.articles.forEach((article,index) => {
                expect(article.article_id).toBe(1+index)
            })
        })
    })
    test("GET: 200 responds with the correct page",() => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&p=2')
        .expect(200)
        .then(({body}) => { 
            expect(body.articles.length).toBe(3)
        })
    })
    test("GET:200 responds with an empty array when the page does not exist",() => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&p=4')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual([])
        })
    })
    test("GET: 400 responds with the appropriate error message when the page number is invalid",() => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&p=invalid')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request')
        })
    })
    test("GET: 200 responds with the total_count with the total number of articles",() => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.total_count).toBe(13)
        })
    })
    test("GET: 200 responds with the total_count when topic filters are appplied",() => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body}) => {
            expect(body.total_count).toBe(0)
        })
    })
})

describe("POST /api/articles",() => {
    test("POST: 201 inserts a new articles and responds with the posted article", () => {
        const newArticle = {
            author : 'butter_bridge',
            title : 'The world of bridges filled with butter',
            body : 'All about making buttery bridges',
            topic : 'mitch'
        }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then(({body}) => {
            expect(body.article.title).toBe('The world of bridges filled with butter')
            expect(body.article.topic).toBe('mitch')
            expect(body.article.author).toBe('butter_bridge')
            expect(body.article.body).toBe('All about making buttery bridges')
            expect(body.article.article_img_url).toEqual(expect.any(String))
            expect(body.article.comment_count).toBe('0')
            expect(body.article.votes).toBe(0)
        })
    })
    test("POST: 400 responds with an appropriate status code and error massage when provided with an invalid data(no author)",()=>{
        const newArticle = {
            body : 'All about making buttery bridges',
            topic : 'mitch'
        }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({body})=>{
            expect(body.message).toBe("Bad request")
        })
    })
    test("POST: 400 responds with an appropriate status code and error message when passed valid fields but invalid values", () => {
        const newArticle = {
            author : 23,
            title : 'The world of bridges filled with butter',
            body : 'All about making buttery bridges',
            topic : 43
        }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .then(({body}) => {
            expect(body.message).toBe('Bad request')
        })
    })
    test("POST: 400 responds with the appropriate error message when passes an invalid author",() => {
        const newArticle = {
            author : 'rainbow_rose',
            title : 'The world of bridges filled with butter',
            body : 'All about making buttery bridges',
            topic : 'mitch'
        }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request')
        })
    })
    test("POST: 201 responds with the article without having the extra property added",() => {
        const newArticle = {
            author : 'butter_bridge',
            title : 'The world of bridges filled with butter',
            body : 'All about making buttery bridges',
            topic : 'mitch',
            brand : 'Flora'
        }
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then(({body})=>{
            expect(body.article).not.toHaveProperty('brand')
        })
    })
})
describe("GET /api/articles/:article_id",()=>{


    test("GET:200 sends a single article to the user",() => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article.article_id).toBe(1)
            expect(body.article.title).toBe('Living in the shadow of a great man')
            expect(body.article.topic).toBe('mitch')
            expect(body.article.author).toBe('butter_bridge')
            expect(body.article.body).toBe('I find this existence challenging')
            expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(body.article.votes).toBe(100)
            expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
    test("GET:400 sends an appropriate status and error message when given an invalid id",()=>{
        return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request')
        })
    })
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", ()=>{
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({body})=>{
            expect(body.message).toBe("Article not found")
        })
    })
    test("GET:200 sends an article object with comment_count to the user",()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                comment_count : '11'
            })
        })
    })
})
describe("GET /api/articles/:article_id/comments",() => {
    test("GET: 200 sends an array of comment for the article_id",()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments.length).toBeGreaterThan(0)
            body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe('number')
                expect(typeof comment.votes).toBe('number')
                expect(typeof comment.created_at).toBe('string')
                expect(typeof comment.author).toBe('string')
                expect(typeof comment.body).toBe('string')
                expect(typeof comment.article_id).toBe('number')
            })
           
        })
    })
    test("GET: 200 responds with array of comments ordered with most recent comments first",() => {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments.length).toBeGreaterThan(0)
            expect(body.comments).toBeSortedBy('created_at',{descending:true})
        })
    })
    test("GET: 200 responds with an empty array if the article_id exists but has no comments",() => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toEqual([])
        })
    })
    test("GET: 404 responds with the appropriate status code and error message when passed an invalid article_id",()=>{
        return request(app)
        .get('/api/articles/99/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Not found')
        })
    })
    test("GET: 404 responds with appropriate status code and error message when given an invalid query",() => {
        return request(app)
        .get('/api/articles/1/invalid-query')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Endpoint not found')
        })
    })
})

describe("POST /api/articles/:article_id/comments",()=>{
    test("POST: 201 inserts a new comment to the db and responds with the posted comment back to the user",() => {
        const newComment = {
            "username" : "butter_bridge",
            "body"  : "The article have given me some beautiful insights into the world of ecommerce"
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body})=>{
            expect(body.comment.comment_id).toBe(19)
            expect(body.comment.author).toBe('butter_bridge')
            expect(body.comment.body).toBe("The article have given me some beautiful insights into the world of ecommerce")
            expect(body.comment.article_id).toBe(2)
            expect(body.comment.votes).toBe(0)
            expect(body.comment).toHaveProperty('created_at')
        })
    })
    test("POST: 400 responds with an appropriate status code and error message when provided with an invalid comment(no author)" ,() => {
        const newComment = {
            "body" : "The world is round around me" 
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request')
        })
    })
    test("POST: 400 responds with the appropriate status code and error message when provided valid fields but invalid values to the fields ",() => {
        const newComment = {
            "username" : 23,
            "body" : 123
        }
        return request(app)
        .post('/api/articles/99/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Bad request")
        })
    })
    test("POST: 400 responds with the appropriate error message when provided with an invalid username" , () => {
        const newComment = {
            "username" : "Pauline32",
            "body"  : "The article have given me some beautiful insights into the world of ecommerce"
        }

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .then(({body})=>{
            expect(body.message).toBe('Bad request')
        })
    })
    test("POST: 201 responds with the comment without having the extra property added to the comment",() => {
        const newComment = {
            "username" : "butter_bridge",
            "body"  : "The article have given me some beautiful insights into the world of ecommerce",
            "layout" : "side by side"
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .then(({body})=>{
            expect(body.comment).not.toHaveProperty('layout')
        })
    })
})

describe("PATCH /api/articles/:article_id",() => {
    test("PATCH: 200 responds with the an updated article when newVote is 1 ",() => {
        const updateArticle = {
            "inc_votes" : 1
        }
        return request(app)
        .patch('/api/articles/1')
        .send(updateArticle)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                "article_id" : 1,
                "topic" : "mitch",
                "votes" : 101
            })
        })
    })
    test("PATCH: 200 responds with an updated article when newVotes is -100",()=>{
        const updateArticle = {
            "inc_votes" : -100
        }
        return request(app)
        .patch('/api/articles/1')
        .send(updateArticle)
        .expect(200)
        .then(({body})=>{
            expect(body.article.votes).toBe(0)
        })
    })
    test("PATCH: 404 responds with an appropriate status code and error message",() => {
        const updateArticle = {
            "inc_votes" : 1
        }
        return request(app)
        .patch('/api/articles/23')
        .send(updateArticle)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Not found')
        })
    })
    test("PATCH: 400 responds with an appropriate status code and error message when given an invalid datatype for the column", () => {
        const updateArticle = {
            "inc_votes" : "abc"
        }
        return request(app)
        .patch('/api/articles/1')
        .send(updateArticle)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Bad request")
        })
    })
    test("PATCH: 400 responds with an appropriate error message when given an invalid article id",() => {
        const updateArticle = {
            "inc_votes" : 1
        }
        return request(app)
        .patch('/api/articles/invalid')
        .send(updateArticle)
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Bad request")
        })
    })
})

describe("DELETE /api/comments/:comment_id",() =>{
    test("DELETE: 204 responds with whether the comment has been deleted",() => {
        return request(app)
        .delete('/api/comments/18')
        .expect(204)
        .then((response)=>{
            return checkIfCommentExists(18)
            .then((result) => {
                expect(result).toBe(false)
            })
        })
    })
    test("DELETE: 400 responds with the appropriate error status code and message when passed an invalid query",() => {
        return request(app)
        .delete('/api/comments/invalid')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request')
        })
    })
})

describe("PATCH /api/comments/:comment_id", () => {
    test("PATCH: 200 responds with the updated comment",() => {
        const updatedComment = {
            inc_votes : 1
        }
        return request(app)
        .patch('/api/comments/1')
        .send(updatedComment)
        .expect(200)
        .then(({body}) => {
            expect(body.comment).toMatchObject({
                comment_id : 1,
                author: "butter_bridge",
                votes: 17
            })
        })
    })
    test("PATCH: 200 responds with the updated comment when the newVotes is -1", () => {
        const updatedComment = {
            inc_votes : -1
        }
        return request(app)
        .patch('/api/comments/1')
        .send(updatedComment)
        .expect(200)
        .then(({body}) => {
            expect(body.comment.votes).toBe(15)
        })
    })
    test("PATCH: 400 responds with an appropriate status code and error message when passed an invalid datatype", () => {
        const updatedComment = {
            inc_votes : "abc"
        }
        return request(app)
        .patch('/api/comments/1')
        .send(updatedComment)
        .then(({body}) => {
            expect(body.message).toBe("Bad request")
        })
    })
    test("PATCH: 400 responds with the appropriate status code and error message when passed an invalid query", () => {
        const updatedComment = {
            inc_votes : 1
        }
        return request(app)
        .patch('/api/comments/invalid')
        .send(updatedComment)
        .then(({body}) => {
            expect(body.message).toBe("Bad request")
        })
    })
    test("PATCH: 404 responds with the appropriate error message when a comment id is passed when not present in the table",() => {
        const updatedComment = {
            inc_votes : 1
        }
        return request(app)
        .patch('/api/comments/999')
        .send(updatedComment)
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Not found')
        })
    })
})

describe("GET /api/users",() => {
    test("GET: 200 responds with the array of user objects" ,() => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users.length).toBe(4)
            body.users.forEach((user) => {
                expect(typeof user.username).toBe('string')
                expect(typeof user.name).toBe('string')
                expect(typeof user.avatar_url).toBe('string')
            })
        })
    })
})

describe("GET /api/users/:username",() => {
    test("GET: 200 responds with a user object to the user",()=>{
        return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({body}) => {
            expect(body.user.username).toBe('lurker')
            expect(body.user.avatar_url).toBe('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
            expect(body.user.name).toBe('do_nothing')
        })
    })
    test("GET: 404 responds with an appropriate error message when passed an invalid name",() => {
        return request(app)
        .get('/api/users/invalid')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('User not found')
        })
    })
})