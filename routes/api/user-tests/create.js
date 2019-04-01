module.exports = function ({models, apiHelpers}) {
  return [
    async (req, res) => {
      let quizApp = req.quizApp
      let userTest = new models.UserTest({quizApp: quizApp._id})
      userTest.addStep('Start', req.body.date)
      await userTest.save()
      res.body = userTest
    }
  ]
}
