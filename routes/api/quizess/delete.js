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

      if (!quiz) throw apiHelpers.createFieldError('quiz', 'Quiz not found')
      await quiz.delete()
      res.body = quiz
    }
  ]
}
