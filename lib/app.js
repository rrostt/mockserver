const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const mocks = {}

const EXPIRE_TIMEOUT = process.env.EXPIRE_TIMEOUT || 60000

app.use(bodyParser.json())

app.use((req, res, next) => {
  next()
  if (!res.headersSent) {
    res.send('nothing to see')
  }
})

app.post('/_mock', (req, res) => {
  const {
    baseUrl,
    method = 'GET',
    response,
    statusCode = 200
  } = req.body

  if (mocks[baseUrl] && mocks[baseUrl].cancel) {
    mocks[baseUrl].cancel()
  }

  const expire = setTimeout(() => delete mocks[baseUrl], EXPIRE_TIMEOUT)
  const cancel = () => clearTimeout(expire)

  mocks[baseUrl] = {
    baseUrl,
    method,
    response,
    statusCode,
    calls: [],
    cancel
  }

  console.log('registered mock for ', baseUrl)
})

app.get('/_call', (req, res) => {
  const baseUrl = req.query.url
  console.log('getting calls for ', baseUrl)
  try {
    const mock = mocks[baseUrl]
    res.json(mock.calls)
    console.log('sent ', mock.calls)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.use('*', (req, res) => {
  console.log('baseurl', req.baseUrl)
  console.log('method', req.method)

  if (mocks[req.baseUrl]) {
    const {
      method,
      response,
      statusCode
      // calls
    } = mocks[req.baseUrl]

    if (req.method === method) {
      mocks[req.baseUrl].calls.push({
        body: req.body,
        query: req.query
      })
      console.log('now mock is', mocks[req.baseUrl])
      res.status(statusCode).send(response)
    }
  }
})

module.exports = app
