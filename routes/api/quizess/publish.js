module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authOwnerForApp,
    async (req, res) => {
      let quizApp = req.quizApp

      let quiz = await models.Quiz.findOne({
        _id: req.params.quizId,
        quizApp: quizApp.id
      })

      if (!quiz) throw apiHelpers.createFieldError('quiz', 'Quiz not found')

      quiz.published = true
      quiz.publishedBy = req.user.id
      quiz.publishedOn = new Date()
      await quiz.save()

      res.body = quiz
    }
  ]
}
