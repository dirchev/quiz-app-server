module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp
      let teachers = await models.User.find({_id: {$in: quizApp.teachers}})
      res.body = teachers
    }
  ]
}
