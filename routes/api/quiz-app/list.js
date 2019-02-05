module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    async (req, res) => {
      let user = req.user

      let quizApps = await models.Application.find({
        teachers: user.id
      })

      res.body = quizApps
    }
  ]
}
