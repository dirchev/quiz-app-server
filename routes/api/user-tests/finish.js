module.exports = function ({models, apiHelpers}) {
  return [
    async (req, res) => {
      let userTest = await models.UserTest.findById(req.params.userTestId)
      userTest.addStep('Finish', req.body.date)
      await userTest.save()
      console.log(JSON.stringify(userTest.toJSON(), null, 2))
      res.body = userTest
    }
  ]
}
