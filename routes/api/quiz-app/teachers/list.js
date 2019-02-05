module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizAppId = req.params.quizAppId

      let quizApp = await models.Application.findOne({
        _id: quizAppId,
        teachers: req.user.id
      }).populate('teachers')

      res.body = quizApp.teachers
    }
  ]
}
