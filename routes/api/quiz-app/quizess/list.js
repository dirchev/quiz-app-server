module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp

      let quizess = await models.Quiz.find({
        quizApp: quizApp.id
      })

      res.body = quizess
    }
  ]
}
