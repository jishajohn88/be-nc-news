const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const request = require("supertest")
const db = require('../db/connection.js')
const endpoints = require('../endpoints.json')
const app = require('../db/app.js')


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
    test("GET: 400 send an appropriate status and error message when given an invalid query", () => {
        return request(app)
        .get('/api/invalid')
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe("Path not found")
        })
    })
})

describe("GET /api/articles/:article_id",()=>{

    test("GET: 200 sends an array of article objects",()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBeGreaterThan(0)
            body.articles.forEach((article)=>{
                expect(typeof article.author).toBe('string')
                expect(typeof article.title).toBe('string')
                expect(typeof article.article_id).toBe('number')
                expect(typeof article.topic).toBe('string')
                expect(typeof article.created_at).toBe('string')
                expect(typeof article.votes).toBe('number')
                expect(typeof article.article_img_url).toBe('string')
                expect(typeof article.comment_count).toBe('string')
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
    test("GET: 400 send an appropriate error message when an invalid query is passed", () => {
        return request(app)
        .get('/api/articleee123')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Path not found")
        })
    })
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
            expect(body.message).toBe("Article does not exist")
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
            const commentObject = {
                'comment_id' : 1,
                'votes' : 30,
                'created_at' : '2018-05-30T15:59:13.341Z',
                'body' : 'I like this fab comment',
                'article_id' : 3
            }
            const desiredCommentObject = {
                'comment_id' : 1,
                'article_id' : 3,
            }
            body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe('number')
                expect(typeof comment.votes).toBe('number')
                expect(typeof comment.created_at).toBe('string')
                expect(typeof comment.author).toBe('string')
                expect(typeof comment.body).toBe('string')
                expect(typeof comment.article_id).toBe('number')
                expect(commentObject).toMatchObject(desiredCommentObject)
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
    test("GET: 400 responds with appropriate status code and error message when given an invalid query",() => {
        return request(app)
        .get('/api/articles/1/invalid-query')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Path not found')
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
    test("PATCH: 400 responds with an appropriate status code and error message", () => {
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
})