var mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/quiz-app'

module.exports = () => {
  mongoose.connect(MONGO_URL, {useNewUrlParser: true})
  let User = require('./user')
  let UserTest = require('./user-test')
  let Application = require('./application')
  let Quiz = require('./quiz')
  let QuizEngagement = require('./quiz-engagement')
  return {
    User,
    UserTest,
    Application,
    Quiz,
    QuizEngagement
  }
}
