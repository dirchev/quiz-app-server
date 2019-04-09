module.exports = function ({models, apiHelpers}) {
  return [
    async (req, res) => {
      let quizAppId = req.params.quizAppId

      let userTests = await models.UserTest.find({
        quizApp: quizAppId,
      })
      console.log('a')
      res.body = userTests
    }
  ]
}
