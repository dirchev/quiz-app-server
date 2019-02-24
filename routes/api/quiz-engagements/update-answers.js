module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    apiHelpers.authStudent,
    async (req, res) => {
      let quizEngagementId = req.params.quizEngagementId
      let quizEngagement = await models.QuizEngagement.findOne({
        student: req.user.id,
        _id: quizEngagementId
      })
      if (!quizEngagement) throw apiHelpers.createError('base', 'Quiz attempt not found', 404)

      quizEngagement.set('answersGiven', req.body.answersGiven)

      await quizEngagement.save()
      res.body = quizEngagement
    }
  ]
}
