module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quiz = req.quiz
      let quizEngagementId = req.params.quizEngagementId
      if (!quiz) throw apiHelpers.createError('base', 'Quiz not found', 404)
      if (!quiz.marksReleased) throw apiHelpers.createError('base', 'Quiz marks not released', 403)

      let quizEngagement = await models.QuizEngagement.findOne({
        student: req.user._id,
        quiz: req.quiz._id,
        _id: quizEngagementId,
        marked: true
      }, '+answersFeedbacks +answersMarks')
      res.body = quizEngagement
    }
  ]
}
