module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    async (req, res) => {
      let user = req.user
      let quizAppId = req.params.quizAppId

      let quizApp = await models.Application.findOne({
        _id: quizAppId,
        teachers: user.id
      })
      if (!quizApp) return res.body = null

      let result = await quizApp.delete()
      res.body = result
    }
  ]
}
