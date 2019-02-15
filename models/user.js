const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const ObjectId = mongoose.Schema.Types.ObjectId

var uniqueValidator = require('mongoose-unique-validator')
const USER_ROLES = {
  'TEACHER': 'teacher',
  'STUDENT': 'student'
}

let schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, required: true, enum: Object.keys(USER_ROLES).map(k => USER_ROLES[k])},

  studentProfile: {
    application: {type: ObjectId, ref: 'Application'}
  },

  auth_tokens: {
    select: false,
    type: [{
      token: String
    }]
  }
})
schema.plugin(uniqueValidator, { message: '{PATH} has already been taken' })

schema.pre('save', async function () {
  var self = this
  if (!this.isModified('password')) return
  let hash = await bcrypt.hash(this.password, 3)
  this.password = hash
  return
})

schema.static('findByCredentials', async function (credentials) {
  if (!credentials.email || credentials.email.trim() === '') return null
  let user = await this.findOne({email: credentials.email.trim().toLowerCase()}).select('+password')
  if (!user) return null
  let passwordMatches = await bcrypt.compare(credentials.password, user.password)
  if (!passwordMatches) return null
  return await this.findOne({email: credentials.email.trim().toLowerCase()})
})

schema.method('generateToken', async function () {
  let cookieData = {
    token: uuid.v4()
  }
  await User.updateOne({_id: this.id}, {$push: {auth_tokens: cookieData}})
  return cookieData.token
})

schema.static('invalidateToken', async function (token) {
  return await this.updateMany({
    $pull: {
      auth_tokens: {token: token}
    }
  })
})

schema.static('findByToken', async function (token) {
  let query = {
    'auth_tokens.token': token
  }
  return await User.findOne(query)
})

let User = mongoose.model('User', schema)
User.USER_ROLES = USER_ROLES
module.exports = User
