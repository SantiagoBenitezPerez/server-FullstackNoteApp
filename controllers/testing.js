const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.get('/', (request, response) => {
  response.send('<h1>hello world</h1>')
})

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter