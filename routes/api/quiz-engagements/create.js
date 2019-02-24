module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    apiHelpers.authStudent,
    async (req, res) => {
      let quizApp = req.quizApp
      let quizId = req.body.quizId
      let quiz = await models.Quiz.findById(quizId)

      if (!quiz) throw apiHelpers.createError('base', 'Quiz not found', 404)

      let quizEngagementData = {
        quizApp: quizApp._id,
        quiz: quiz._id,
        student: req.user._id,
        timeLimit: quiz.timeLimit,
        answersGiven: {},
        started: true,
        startedAt: new Date()
      }

      let quizEngagement = await models.QuizEngagement.create(quizEngagementData)
      res.body = quizEngagement
    }
  ]
}
