module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    apiHelpers.authStudent,
    async (req, res) => {
      let quizApp = req.quizApp
      let quiz = req.quiz

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
