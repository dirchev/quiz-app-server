const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let schema = new mongoose.Schema({
  quizApp: {type: ObjectId, ref: 'Application', required: true},
  user: {type: ObjectId, ref: 'User'},
  flags: {
    type: Map,
    of: Date
  },
  steps: {
    type: Map,
    of: Date
  },
  logs: [{
    type: {type: String},
    name: String,
    date: Date
  }]
})

schema.method('addFlag', function (flagName, date) {
  if (!this.flags) this.flags = new Map()
  if (!this.flags.get(flagName)) this.flags.set(flagName, date)
  this.logs.push({
    type: 'flag',
    name: flagName,
    date: date
  })
})

schema.method('addStep', function (stepName, date) {
  if (!this.steps) this.steps = new Map()
  if (!this.steps.get(stepName)) this.steps.set(stepName, date)
  this.logs.push({
    type: 'step',
    name: stepName,
    date: date
  })
})

let UserTest = mongoose.model('UserTest', schema)

module.exports = UserTest
