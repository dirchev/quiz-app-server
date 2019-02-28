module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    apiHelpers.authTeacher,
    async (req, res) => {
      let quizApp = req.quizApp
      let students = await models.User.find({_id: {$in: quizApp.students}})
      res.body = students
    }
  ]
}
