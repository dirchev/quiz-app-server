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

  it('sets up application', async () => {
    let user = new User({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })

    let user2 = new User({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })

    let application = new Application({
      name: faker.internet.domainName(),
      subdomain: faker.internet.userName(),
      description: faker.lorem.paragraph(),
      owner: user.id,
      teachers: [
        user.id
      ]
    })
    assert.strictEqual(application.hasTeacher(user.id), true)
    assert.strictEqual(application.hasTeacher(user2.id), false)
  })

  it('creates application', async () => {
    let user = await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })

    let user2 = await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })

    let application = await Application.create({
      name: faker.internet.domainName(),
      subdomain: faker.internet.userName(),
      description: faker.lorem.paragraph(),
      owner: user.id,
      teachers: [
        user.id
      ]
    })

    assert.strictEqual(application.hasTeacher(user.id), true)
    assert.strictEqual(application.hasTeacher(user2.id), false)
  })
})
