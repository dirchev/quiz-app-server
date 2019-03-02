module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    apiHelpers.authTeacher,
    async (req, res) => {
      let quizEngagementId = req.params.quizEngagementId
      let quizEngagement = await models.QuizEngagement.findById(quizEngagementId, '+answersMarks +answersFeedbacks')

      quizEngagement.set('marked', true)
      quizEngagement.set('markedAt', new Date())

      await quizEngagement.save()
      res.body = quizEngagement
    }
  ]
}
