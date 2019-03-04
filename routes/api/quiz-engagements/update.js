module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizEngagementId = req.params.quizEngagementId
      let query = {
        _id: quizEngagementId
      }
      let select = ''
      if (req.user.role === models.User.USER_ROLES.STUDENT) {
        query.student = req.user._id
      } else if (req.user.role === models.User.USER_ROLES.TEACHER) {
        select = '+answersMarks +answersFeedbacks'
      }
      let quizEngagement = await models.QuizEngagement.findOne(query, select)
      if (!quizEngagement) throw apiHelpers.createError('base', 'Quiz attempt not found', 404)

      if (req.user.role === models.User.USER_ROLES.STUDENT) {
        quizEngagement.set('answersGiven', req.body.answersGiven)
      } else if (req.user.role === models.User.USER_ROLES.TEACHER) {
        quizEngagement.set('answersMarks', req.body.answersMarks)
        quizEngagement.set('answersFeedbacks', req.body.answersFeedbacks)
      }

      await quizEngagement.save()
      res.body = quizEngagement
    }
  ]
}
