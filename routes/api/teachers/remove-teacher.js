module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    async (req, res) => {
      let user = req.user
      let quizAppId = req.params.quizAppId
      let teacherId = req.params.teacherId

      let quizApp = await models.Application.findOne({
        _id: quizAppId,
        owner: user.id
      })

      if (!quizApp) throw apiHelpers.createError({
        base: 'Quiz app not found.'
      }, 404, 'ValidationError')

      let teacherToRemove = await models.User.findOne({
        _id: teacherId,
        role: models.User.USER_ROLES.TEACHER
      })

      if (!teacherToRemove) throw apiHelpers.createError({
        teacherEmail: 'teacher not found'
      }, 422, 'ValidationError')

      quizApp.teachers.pull(teacherToRemove.id)
      await quizApp.save()
      res.body = teacherToRemove
    }
  ]
}
