const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

var uniqueValidator = require('mongoose-unique-validator')

let schema = new mongoose.Schema({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true, lowercase: true },
  joinCode: { type: String, select: false },
  owner: { type: ObjectId, ref: 'User' },
  teachers: [
    { type: ObjectId, ref: 'User' }
  ],
  students: [
    { type: ObjectId, ref: 'User' }
  ],
})
schema.plugin(uniqueValidator, { message: '{PATH} has already been taken' })

schema.method('hasTeacher', function (userId) {
  for (let teacherId of this.teachers) {
    if (teacherId.equals(userId)) return true
  }
  return false
})

schema.method('hasStudent', function (userId) {
  for (let studentId of this.students) {
    if (studentId.equals(userId)) return true
  }
  return false
})

schema.method('addStudent', async function (userId) {
  this.students.addToSet(userId)
  return this.save()
})

let Application = mongoose.model('Application', schema)
module.exports = Application
