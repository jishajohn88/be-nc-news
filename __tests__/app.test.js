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
            expect(body.message).toBe('Invalid id type')
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