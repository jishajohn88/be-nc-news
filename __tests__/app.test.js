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