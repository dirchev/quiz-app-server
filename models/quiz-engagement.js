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

  marked: {type: Boolean},
  markedAt: {type: Date},

  answersGiven: {
    type: Map,
    of: Mixed
  },

  answersMarks: {
    type: Map,
    of: Number,
    select: false
  },

  answersFeedbacks: {
    type: Map,
    of: Number,
    select: false
  }
})

schema.pre('validate', async function () {
  if (!this.isNew) return // only validate quizess that are being currently created
  let currentId = this._id
  let quizId = this.quiz._id
  let studentId = this.student._id
  if (!currentId || !quizId || !studentId) return // validation will handle these cases
  let quiz = await mongoose.model('Quiz').findById(quizId)
  if (!quiz || !quiz.published) {
    this.invalidate('quiz', 'Quiz does not exist or is not published.')
    return
  }
  let noOfAttempts = quiz.noOfAttempts
  if (!noOfAttempts) return // number of attempts is unlimited
  let existingEngagementsCount = await mongoose.model('QuizEngagement').countDocuments({
    _id: {$ne: currentId},
    student: studentId,
    quiz: quizId
  })
  if (existingEngagementsCount >= noOfAttempts) {
    this.invalidate('student', 'Number of attempts are reached for this quiz.')
  }
})

let QuizEngagement = mongoose.model('QuizEngagement', schema)

module.exports = QuizEngagement
