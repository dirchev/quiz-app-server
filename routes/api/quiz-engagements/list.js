module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    apiHelpers.authStudent,
    async (req, res) => {
      let quizId = req.params.quizId
      let quiz = await models.Quiz.findById(quizId)

      if (!quiz) throw apiHelpers.createError('base', 'Quiz not found', 404)

      let quizEngagements = await models.QuizEngagement.find({
        quiz: quiz._id,
        student: req.user._id,
        finished: true
      }).sort({started: -1})

      res.body = quizEngagements
    }
  ]
}
