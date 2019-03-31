module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    async (req, res) => {
      let user = req.user
      let quizAppId = req.params.quizAppId

      let select = ''

      if (req.user.role === models.User.USER_ROLES.TEACHER) {
        select = '+joinCode'
      }

      let quizApp = await models.Application.findOne({
        _id: quizAppId,
        teachers: user.id
      }, '+joinCode')
      res.body = quizApp
    }
  ]
}
