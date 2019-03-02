module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quiz = req.quiz

      if (!quiz) throw apiHelpers.createError('base', 'Quiz not found', 404)
      let populate = ''
      let query = {
        quiz: quiz._id,
        finished: true
      }
      let select = ''
      if (req.user.role === models.User.USER_ROLES.STUDENT) {
        query.student = req.user._id
      }
      if (req.user.role === models.User.USER_ROLES.TEACHER) {
        populate = 'student'
        select = '+answersMarks +answersFeedbacks'
      }

      let quizEngagements = await models.QuizEngagement.find(query, select).populate(populate).sort({finishedAt: -1})

      res.body = quizEngagements
    }
  ]
}
