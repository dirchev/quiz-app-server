module.exports = function ({models, apiHelpers}) {
  return [
    async (req, res) => {
      let userTest = await models.UserTest.findById(req.params.userTestId)
      if (req.user) {
        userTest.user = req.user._id
      }
      userTest.addStep(req.body.key, req.body.date)
      await userTest.save()
      res.body = userTest
    }
  ]
}
