module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp
      let data = req.body
      data.quizApp = quizApp.id

      let quiz = new models.Quiz(data)
      await quiz.save()

      res.body = quiz
    }
  ]
}
