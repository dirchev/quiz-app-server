const _ = require('lodash')
module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp

      let query = {
        quizApp: quizApp.id
      }
      if (req.user.role === models.User.USER_ROLES.STUDENT) {
        query.published = true
      }
      let quizess = await models.Quiz.find(query).lean(true)
      let response = quizess.map((quiz) => {
        if (req.user.role === models.User.USER_ROLES.STUDENT) {
          let fieldsToPick = [
            '_id',
            'name',
            'description',
            'quizApp',
            'isMandatory',
            'noOfAttempts',
            'deadline',
            'timeLimit',
            'marksReleased',
            'published',
            'publishedBy',
            'isAvailableOffline',
            'publishedOn',
          ]
          return _.pick(quiz, fieldsToPick)
        } else {
          return quiz
        }
      })

      res.body = response
    }
  ]
}
