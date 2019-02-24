var mongoose = require('mongoose')

module.exports = () => {
  mongoose.connect('mongodb://localhost/quiz-app', {useNewUrlParser: true})
  let User = require('./user')
  let Application = require('./application')
  let Quiz = require('./quiz')
  let QuizEngagement = require('./quiz-engagement')
  return {
    User,
    Application,
    Quiz,
    QuizEngagement
  }
}
