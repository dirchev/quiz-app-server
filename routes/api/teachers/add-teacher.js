const Joi = require('joi')

module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    async (req, res) => {
      let quizApp = req.quizApp
      let teacherEmail = req.body.email.toString()
      let newTeacher = await models.User.findOne({
        email: teacherEmail,
        role: models.User.USER_ROLES.TEACHER
      })

      if (!newTeacher) throw apiHelpers.createFieldError('teacherEmail', 'Teacher not found with this email', 404, 'ValidationError')
      quizApp.teachers.addToSet(newTeacher.id)
      await quizApp.save()
      res.body = newTeacher
    }
  ]
}
