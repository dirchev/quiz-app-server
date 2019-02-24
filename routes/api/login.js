const Joi = require('joi')

module.exports = function ({models, apiHelpers}) {
  let schema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })

  let loginTeacher = async function (req, res) {
    let data = await Joi.validate({
      email: req.body.email,
      password: req.body.password,
    }, schema)
    let user = await models.User.findByCredentials(data)
    if (!user) {
      let error = apiHelpers.createFieldError('base', 'email and password combination is not valid')
      throw error
    }
    let token = await user.generateToken()
    res.body = {
      user: user.toJSON(),
      token: token
    }
  }

  let loginStudent = async function (req, res) {
    let data = await Joi.validate({
      email: req.body.email,
      password: req.body.password,
    }, schema)
    let user = await models.User.findByCredentials(data)
    if (!user) {
      let error = apiHelpers.createFieldError('base', 'email and password combination is not valid')
      throw error
    }
    if (!await req.quizApp.hasStudent(user.id)) {
      let error = apiHelpers.createFieldError('base', 'You do not have access to quiz app.')
      throw error
    }
    let token = await user.generateToken()
    res.body = {
      user: user.toJSON(),
      token: token
    }
  }

  return [
    async (req, res) => {
      if (req.isUsingSubDomain) return loginStudent(req, res)
      else return loginTeacher(req, res)
    }
  ]
}
