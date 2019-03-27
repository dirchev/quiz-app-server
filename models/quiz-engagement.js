const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed
const {xor, find} = require('lodash')

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
    of: String,
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

let getPointsForQuestionAnswer = function (question, answerGiven) {
  switch (question.type) {
    case 'MCQ_ONE_RIGHT':
      return question.answers.correctId === answerGiven
        ? question.points
        : 0
    case 'MCQ_MULTIPLE_RIGHT':
      let idsOfCorrectAnswers = question.answers.options.filter(({isCorrect}) => isCorrect).map(({_id}) => _id)
      return xor(idsOfCorrectAnswers, answerGiven).length === 0
        ? question.points
        : 0
    case 'FREE_SHORT_TEXT':
      return answerGiven === question.correctAnswer
        ? question.points
        : 0
    default:
      return 0
  }
}

schema.static('calculateMarksForQuizEngagement', async function (quizEngagementId) {
  let quizEngagement = await mongoose.model('QuizEngagement').findById(quizEngagementId, '+answersMarks +answersFeedbacks')
  let quiz = await mongoose.model('Quiz').findById(quizEngagement.quiz)
  await quizEngagement.calculateMarks()
  if (quiz.canMarkAutomatically) {
    quizEngagement.marked = true
    quizEngagement.markedAt = new Date
  }
  return quizEngagement.save()
})

schema.method('calculateMarks', async function () {
  let quiz = await mongoose.model('Quiz').findById(this.quiz)
  this.set('answersMarks', new Map())
  this.set('answersFeedbacks', new Map())
  Object.keys(this.toJSON().answersGiven).forEach((questionId) => {
    let question = find(quiz.questions, ({_id}) => _id.toString() === questionId)
    let points = getPointsForQuestionAnswer(question, this.answersGiven[questionId])
    this.answersMarks.set(questionId, points)
    this.answersFeedbacks.set(questionId, question.defaultFeedback)
  })
})

let QuizEngagement = mongoose.model('QuizEngagement', schema)

module.exports = QuizEngagement
