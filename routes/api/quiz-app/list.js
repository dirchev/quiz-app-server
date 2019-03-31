module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authTeacher,
    async (req, res) => {
      let user = req.user

      let quizApps = await models.Application.find({
        teachers: user.id
      }, '+joinCode')

      res.body = quizApps
    }
  ]
}
