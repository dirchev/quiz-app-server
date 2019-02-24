module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authOwnerForApp,
    async (req, res) => {
      let user = req.user
      let teacherId = req.params.teacherId

      let quizApp = req.quizApp

      if (!quizApp) throw apiHelpers.createError('base', 'Quiz app not found', 404)

      let teacherToRemove = await models.User.findOne({
        _id: teacherId,
        role: models.User.USER_ROLES.TEACHER
      })

      if (!teacherToRemove) throw apiHelpers.createFieldError('base', 'Teacher not found', 422)
      if (quizApp.owner.equals(teacherToRemove.id)) throw apiHelpers.createFieldError('base', 'Owner can not be removed', 422)

      quizApp.teachers.pull(teacherToRemove.id)
      await quizApp.save()
      res.body = teacherToRemove
    }
  ]
}
