const User = require('../../models/user')
const Application = require('../../models/application')
const mongoose = require('mongoose')
const assert = require('assert')
const faker = require('faker')

describe('application model', () => {
  before(async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/quiz-app-test', {useNewUrlParser: true})
  })
  after(async function () {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  it('creates users with the same email', async () => {
    let email = faker.internet.email()
    let user = new User({
      name: faker.name.firstName(),
      email: email,
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })

    await user.save()

    let user2 = new User({
      name: faker.name.firstName(),
      email: email,
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })

    assert.rejects(
      user2.save(),
      {
        name: 'ValidationError',
        message: 'User validation failed: email: email has already been taken'
      }
    )
  })
})
