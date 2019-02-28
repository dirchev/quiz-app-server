module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authTeacher,
    apiHelpers.authOwnerForApp,
    async (req, res) => {
      let studentId = req.params.studentId

      let quizApp = req.quizApp

      if (!quizApp) throw apiHelpers.createError('base', 'Quiz app not found', 404)

      let studentToRemove = await models.User.findOne({
        _id: studentId,
        role: models.User.USER_ROLES.STUDENT
      })

      if (!studentToRemove) throw apiHelpers.createFieldError('base', 'Student not found', 422)
      if (quizApp.owner.equals(studentToRemove.id)) throw apiHelpers.createFieldError('base', 'Owner can not be removed', 422)

      quizApp.students.pull(studentToRemove.id)
      await quizApp.save()
      res.body = studentToRemove
    }
  ]
}
