module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    apiHelpers.authStudent,
    async (req, res) => {
      let quiz = req.quiz
      let quizEngagementId = req.params.quizEngagementId
      let quizEngagement = await models.QuizEngagement.findOne({
        student: req.user.id,
        _id: quizEngagementId
      })
      if (!quizEngagement) throw apiHelpers.createError('base', 'Quiz attempt not found', 404)
      if (!quizEngagement.started) throw apiHelpers.createError('base', 'Quiz attempt not started', 404)
      if (quizEngagement.finished) throw apiHelpers.createError('base', 'Quiz attempt already finished', 404)

      quizEngagement.finished = true
      quizEngagement.finishedAt = new Date()

      await quizEngagement.save()
      res.body = quizEngagement
      models.QuizEngagement.calculateMarksForQuizEngagement(quizEngagement.id) // async, do not wait
    }
  ]
}
