module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    apiHelpers.authStudent,
    async (req, res) => {
      let quizEngagementId = req.params.quizEngagementId
      let quizEngagement = await models.QuizEngagement.findOne({
        _id: quizEngagementId,
        student: req.user._id,
      })
      res.body = quizEngagement
    }
  ]
}
