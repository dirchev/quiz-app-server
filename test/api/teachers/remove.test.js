const mongoose = require('mongoose')
const User = mongoose.model('User')
const Application = mongoose.model('Application')
const faker = require('faker')
const initServer = require(process.cwd() + '/server.js')

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

describe('DELETE /api/teachers/:id', () => {
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
    this.teacher2Token = await this.teacher2.generateToken()
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

  it('does not allow non application owner to remove teachers', async function () {
    let {res, body} = await this.request
      .delete(`/api/quiz-app/${this.application.id.toString()}/teachers/${this.teacher2.id.toString()}`)
      .set('authtoken', this.teacher2Token)
      .send({})
    expect(res.statusCode).to.eq(403)
    expect(body).to.deep.eq({
      errors: [
        {
          message: "Operation not allowed",
          path: "base"
        }
      ],
      name: "ValidationError"
    })
  })

  it('does not allow application owner to be removed', async function () {
    let {res, body} = await this.request
      .delete(`/api/quiz-app/${this.application.id.toString()}/teachers/${this.teacher.id.toString()}`)
      .set('authtoken', this.teacherToken)
      .send({})
    expect(res.statusCode).to.eq(422)
    expect(body).to.deep.eq({
      errors: [
        {
          message: "Owner can not be removed",
          path: "teacher"
        }
      ],
      name: "ValidationError"
    })
  })

  it('removes a teacher', async function () {
    let {res, body} = await this.request
      .delete(`/api/quiz-app/${this.application.id.toString()}/teachers/${this.teacher2.id.toString()}`)
      .set('authtoken', this.teacherToken)
      .send({})
    expect(res.statusCode).to.eq(200)
    expect(body).to.exist
    expect(body._id).to.eq(this.teacher2.id.toString())

    let application = await mongoose.model('Application').findById(this.application.id)
    expect(application.teachers.length).to.eq(1)
    expect(application.teachers[0].toString()).to.eq(this.teacher.id.toString())
  })
})
