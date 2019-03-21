const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

var uniqueValidator = require('mongoose-unique-validator')

let schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quizApp: {type: ObjectId, ref: 'Application', required: true},
  questions: [
    {
      _id: { type: String },
      title: { type: String },
      content: { type: String },
      points: { type: Number }, // max number of points for right answer
      type: {
        type: String,
        enum: [
          'MCQ_MULTIPLE_RIGHT',
          'MCQ_ONE_RIGHT',
          'FREE_SHORT_TEXT',
          'FREE_LONG_TEXT'
        ]
      },
      answers: {type: Mixed}
    }
  ],

  // settings
  isAvailableOffline: { type: Boolean, default: false },
  isMandatory: { type: Boolean, default: false },
  noOfAttempts: { type: Number, default: 0 },
  deadline: { type: Date },
  timeLimit: { type: Number }, // in minutes

  // when published
  marksReleased: {type: Boolean},

  // publish info
  published: {type: Boolean, default: false},
  publishedBy: {type: ObjectId, ref: 'User'},
  publishedOn: {type: Date}
})
schema.plugin(uniqueValidator, { message: '{PATH} has already been taken' })

schema.pre('validate', async function () {
  if (this.isModified('published') && this.published) {
    if (!this.questions.length) this.invalidate('questions', 'can not publish quiz without questions', this.questions)
  }
})

schema.method('getQuestionsDetails', function () {
  return this.questions.map(function (question) {
    if (['MCQ_MULTIPLE_RIGHT', 'MCQ_ONE_RIGHT'].indexOf(question.type) !== -1) {
      return {
        _id: question._id,
        title: question.title,
        content: question.content,
        type: question.type,
        answers: {
          options: question.answers.options.map((answer) => {
            return {
              _id: answer._id,
              text: answer.text
            }
          })
        }
      }
    } else if (['FREE_SHORT_TEXT', 'FREE_LONG_TEXT'].indexOf(question.type) !== -1) {
      return {
        _id: question._id,
        title: question.title,
        content: question.content,
        type: question.type,
      }
    }
  })
})

let Quiz = mongoose.model('Quiz', schema)

module.exports = Quiz
