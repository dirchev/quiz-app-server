/**
 * Used to fully sync offline created quiz engagements on the client app
 */
module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authStudent,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quiz = req.quiz
      let quizEngagementData = req.body
      let quizEngagement = new models.QuizEngagement(quizEngagementData)

      await quizEngagement.save()
      res.body = quizEngagement
      if (quizEngagement.finished) {
        models.QuizEngagement.calculateMarksForQuizEngagement(quizEngagement.id) // async, do not wait
      }
    }
  ]
}
