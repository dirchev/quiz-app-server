module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp

      let query = {
        quizApp: quizApp.id
      }
      let select = {}
      if (req.user.role === models.User.USER_ROLES.STUDENT) {
        query.published = true
        select = {
          name: 1,
          description: 1,
          quizApp: 1,
          isMandatory: 1,
          noOfAttempts: 1,
          deadline: 1,
          timeLimit: 1,
          marksReleased: 1
        }
      }
      let quizess = await models.Quiz.find(query).select(select)

      res.body = quizess
    }
  ]
}
