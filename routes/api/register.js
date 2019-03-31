const Joi = require('joi')

module.exports = function ({models, apiHelpers}) {
  let teacherSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
  let studentSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    joinCode: Joi.string().required()
  })

  let registerTeacher = async function (req, res) {
    let data = await Joi.validate({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }, teacherSchema)
    data.role = models.User.USER_ROLES.TEACHER
    let user = await models.User.create(data)
    await user.save()
    res.body = {success: true}
  }

  let registerStudent = async function (req, res) {
    let data = await Joi.validate({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      joinCode: req.body.joinCode
    }, studentSchema)
    req.quizApp = await models.Application.findById(req.quizApp.id).select('+joinCode') // get the join code
    if (req.quizApp.joinCode !== data.joinCode) {
      throw apiHelpers.createFieldError('joinCode', 'Join code is not valid', 422)
    }
    let newlyCreated = false
    let user = await models.User.findOne({
      email: req.body.email,
      role: models.User.USER_ROLES.STUDENT
    })
    if (!user) {
      newlyCreated = true
      user = await models.User.create({
        name: data.name,
        email: data.email,
        password: req.body.password,
        role: models.User.USER_ROLES.STUDENT
      })
    }
    await req.quizApp.addStudent(user.id)
    res.body = {success: true}
  }

  return [
    async (req, res) => {
      if (req.isUsingSubDomain) return registerStudent(req, res)
      else return registerTeacher(req, res)
    }
  ]
}
