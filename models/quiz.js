const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Mixed = mongoose.Schema.Types.Mixed

var uniqueValidator = require('mongoose-unique-validator')

let schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quizApp: {type: ObjectId, ref: 'Application', required: true},
  questions: Mixed,

  // settings
  isMandatory: { type: Boolean, default: false },
  noOfAttempts: { type: Number, default: 0 },
  deadline: { type: Date },

  // when published
  answersReleased: Boolean,
  marksReleased: Boolean,

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

let Quiz = mongoose.model('Quiz', schema)

module.exports = Quiz
