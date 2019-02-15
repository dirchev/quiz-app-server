module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    async (req, res) => {
      let user = req.user
      let quizAppId = req.params.quizAppId
      let teacherEmail = req.body.email

      let quizApp = await models.Application.findOne({
        _id: quizAppId,
        owner: user.id
      })

      if (!quizApp) throw apiHelpers.createError({
        base: 'Quiz app not found.'
      }, 404, 'ValidationError')

      let newTeacher = await models.User.findOne({
        email: teacherEmail,
        role: models.User.USER_ROLES.TEACHER
      })

      if (!newTeacher) throw apiHelpers.createError({
        teacherEmail: 'teacher not found with this email'
      }, 422, 'ValidationError')

      quizApp.teachers.addToSet(newTeacher.id)
      await quizApp.save()
      res.body = newTeacher
    }
  ]
}
