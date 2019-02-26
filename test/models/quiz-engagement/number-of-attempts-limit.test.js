const mongoose = require('mongoose')
const User = mongoose.model('User')
const Application = mongoose.model('Application')
const Quiz = mongoose.model('Quiz')
const QuizEngagement = mongoose.model('QuizEngagement')
const assert = require('assert')
const faker = require('faker')

describe('application model', function () {
  before(async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/quiz-app-test', {useNewUrlParser: true})
  })
  after(async function () {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  before(async function () {
    this.teacher = await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: User.USER_ROLES.TEACHER
    })

    this.student = await User.create({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: User.USER_ROLES.STUDENT
    })

    this.application = await Application.create({
      name: faker.internet.domainName(),
      subdomain: faker.internet.userName(),
      description: faker.lorem.paragraph(),
      owner: this.teacher._id,
      teachers: [this.teacher._id],
      students: [this.student._id],
    })

    this.quizWithLimitedAttempts = await Quiz.create({
      name: 'Test Quiz',
      description: 'Test quiz description',
      quizApp: this.application._id,
      questions: [
        {
          _id: '1234',
          title: 'Some title',
          content: 'Some test content',
          points: 10,
          type: 'FREE_SHORT_TEXT'
        }
      ],

      isMandatory: true,
      noOfAttempts: 1,

      published: true,
      publishedBy: this.teacher._id,
      publishedOn: new Date()
    })

    this.quizWithUnlimitedAttempts = await Quiz.create({
      name: 'Test Quiz',
      description: 'Test quiz description',
      quizApp: this.application._id,
      questions: [
        {
          _id: '1234',
          title: 'Some title',
          content: 'Some test content',
          points: 10,
          type: 'FREE_SHORT_TEXT'
        }
      ],

      isMandatory: true,
      noOfAttempts: 0,

      published: true,
      publishedBy: this.teacher._id,
      publishedOn: new Date()
    })
  })

  it('can create infinite engagements for quiz with unlimited number attempts', async function () {
    // Create first engagement
    await QuizEngagement.create({
      quizApp: this.application._id,
      quiz: this.quizWithUnlimitedAttempts._id,
      student: this.student._id,
      started: true,
      startedAt: new Date()
    })
    // Create second engagement
    await QuizEngagement.create({
      quizApp: this.application._id,
      quiz: this.quizWithUnlimitedAttempts._id,
      student: this.student._id,
      started: true,
      startedAt: new Date()
    })
  })

  it('should not allow more quiz engagements than the limit', async function () {
    // Create first engagement
    await QuizEngagement.create({
      quizApp: this.application._id,
      quiz: this.quizWithLimitedAttempts._id,
      student: this.student._id,
      started: true,
      startedAt: new Date()
    })

    // Create second engagement
    let invalidEngagement = new QuizEngagement({
      quizApp: this.application._id,
      quiz: this.quizWithLimitedAttempts._id,
      student: this.student._id,
      started: true,
      startedAt: new Date()
    })
    await assert.rejects(
      invalidEngagement.save(),
      'User validation failed: email: email has already been taken'
    )
  })
})
