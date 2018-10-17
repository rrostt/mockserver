const request = require('supertest')

const EXPIRE_TIMEOUT = 2000
process.env.EXPIRE_TIMEOUT = EXPIRE_TIMEOUT

const app = require('../../lib/app')

describe('app', () => {
  test('mocked GET url returns response', () => {
    const baseUrl = '/hello'
    const method = 'GET'
    const response = {x: 3}
    return request(app)
      .post('/_mock')
      .send({ baseUrl, method, response })
      .then(_ =>
        request(app)
          .get(baseUrl)
          .expect(200)
          .then(actual => {
            expect(actual.text).toBe(JSON.stringify(response))
          })
      )
  })
  test('mocked POST url returns response', () => {
    const baseUrl = '/hello'
    const method = 'POST'
    const response = {y: 4}
    return request(app)
      .post('/_mock')
      .send({ baseUrl, method, response })
      .then(_ =>
        request(app)
          .post(baseUrl)
          .send()
          .expect(200)
          .then(actual => {
            expect(actual.text).toBe(JSON.stringify(response))
          })
      )
  })
  test('mocked GET url returns response with statusCode', () => {
    const baseUrl = '/hello'
    const method = 'GET'
    const response = {x: 5}
    const statusCode = 301
    return request(app)
      .post('/_mock')
      .send({ baseUrl, method, response, statusCode })
      .then(_ =>
        request(app)
          .get(baseUrl)
          .expect(statusCode)
      )
  })

  test('unmocked method returned 500', () => {
    return request(app)
      .get('/undefined')
      .expect(200)
      .then(actual => {
        expect(actual.text).toBe('nothing to see')
      })
  })

  test('mocked method cleared after expire timeout', () => {
    const baseUrl = '/hello'
    const method = 'GET'
    const response = {x: 5}
    const statusCode = 301
    return request(app)
      .post('/_mock')
      .send({ baseUrl, method, response, statusCode })
      .then(_ => new Promise((resolve, reject) => setTimeout(resolve, EXPIRE_TIMEOUT + 1000)))
      .then(_ =>
        request(app)
          .get(baseUrl)
          .expect(200)
          .then(actual => {
            expect(actual.text).toBe('nothing to see')
          })
      )
  })
})
