module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp
      res.body = quizApp.teachers
    }
  ]
}
