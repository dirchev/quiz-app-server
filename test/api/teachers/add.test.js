const mongoose = require('mongoose')
const User = mongoose.model('User')
const Application = mongoose.model('Application')
const faker = require('faker')
const initServer = require(process.cwd() + '/server.js')

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

describe('POST /api/teachers', () => {
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
        this.teacher.id
      ]
    })
  })

  it('rejects the adding of teacher when no teacher exists with the given email', async function () {
    let {res, body} = await this.request
      .post(`/api/quiz-app/${this.application.id.toString()}/teachers`)
      .set('authtoken', this.teacherToken)
      .send({
        email: 'nonsence@example.com'
      })
    expect(res.statusCode).to.eq(422)
    expect(body).to.deep.eq({
      errors: [
        {
          message: 'Teacher not found with this email',
          path: 'teacherEmail'
        }
      ],
      name: 'ValidationError'
    })
  })

  it('adds teacher with given email', async function () {
    let {res, body} = await this.request
      .post(`/api/quiz-app/${this.application.id.toString()}/teachers`)
      .set('authtoken', this.teacherToken)
      .send({
        email: this.teacher2.email
      })
    expect(res.statusCode).to.eq(200)
    expect(body).to.exist
    expect(body._id).to.eq(this.teacher2._id.toString())
  })
})
