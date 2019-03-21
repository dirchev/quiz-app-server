/**
 * Used to fully sync offline created quiz engagements on the client app
 */
module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authStudent,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizEngagementData = req.body
      let quizEngagement = await models.QuizEngagement.create(quizEngagementData)
      res.body = quizEngagement
    }
  ]
}
