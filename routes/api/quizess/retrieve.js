module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp

      let quiz = await models.Quiz.findOne({
        _id: req.params.quizId,
        quizApp: quizApp.id
      })

      if (!quiz) throw apiHelpers.createError('base', 'Quiz not found', 403)

      if (req.user.role === models.User.USER_ROLES._STUDENT && !quiz.marksReleased) {
        throw apiHelpers.createError('base', 'Quiz marks not released', 403)
      }

      res.body = quiz
    }
  ]
}
