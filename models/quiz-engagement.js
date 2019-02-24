const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

let schema = new mongoose.Schema({
  quizApp: {type: ObjectId, ref: 'Application', required: true},
  quiz: {type: ObjectId, ref: 'Quiz', required: true},
  student: {type: ObjectId, ref: 'User', required: true},

  started: {type: Boolean},
  startedAt: {type: Date},
  timeLimit: {type: Number},

  finished: {type: Boolean},
  finishedAt: {type: Date},

  answersGiven: {
    type: Map,
    of: Mixed
  }
})


let QuizEngagement = mongoose.model('QuizEngagement', schema)

module.exports = QuizEngagement
