module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authStudent,
    async (req, res) => {
      let quizApp = req.quizApp

      let quiz = await models.Quiz.findOne({
        _id: req.params.quizId,
        quizApp: quizApp.id,
        published: true,
        $or: [
          {
            deadline: {$gt: new Date()}
          },
          {
            deadline: {$eq: null}
          }
        ]
      })
      if (!quiz) throw apiHelpers.createError('quiz', 'Quiz not found.', 404, 'ValidationError')
      let questionsDetails = quiz.getQuestionsDetails()
      res.body = questionsDetails
    }
  ]
}
