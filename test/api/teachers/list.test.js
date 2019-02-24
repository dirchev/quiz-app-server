const mongoose = require('mongoose')
const User = mongoose.model('User')
const Application = mongoose.model('Application')
const faker = require('faker')
const initServer = require(process.cwd() + '/server.js')

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

describe('GET /api/teachers', () => {
  before(async function () {
    this.server = await initServer()
    this.request = await chai.request(this.server).keepOpen()
    await mongoose.connection.dropDatabase()
  })

  after(async function () {
    this.request.close()
    await mongoose.connection.close()
  })

  before(async function () {
    this.teacher = await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })
    this.teacherToken = await this.teacher.generateToken()
    this.teacher2 = await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })
    this.application = await Application.create({
      name: faker.lorem.text(),
      subdomain: faker.lorem.slug(),
      description: faker.lorem.paragraph(),
      owner: this.teacher.id,
      teachers: [
        this.teacher.id,
        this.teacher2.id
      ]
    })
  })

  it('lists all teachers', async function () {
    let {res, body} = await this.request
      .get(`/api/quiz-app/${this.application.id.toString()}/teachers`)
      .set('authtoken', this.teacherToken)
      .send({})
    expect(res.statusCode).to.eq(200)
    expect(body).to.exist
    expect(body.length).to.eq(2)
    expect(body[0]._id).to.eq(this.teacher._id.toString())
    expect(body[1]._id).to.eq(this.teacher2._id.toString())
  })
})
