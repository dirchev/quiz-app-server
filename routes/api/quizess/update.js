const _ = require('lodash')

module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp
      let data = _.omit(req.body, ['_id', 'published', '__v'])

      let quiz = await models.Quiz.findOne({
        _id: req.params.quizId,
        quizApp: quizApp.id
      })

      if (!quiz) throw apiHelpers.createError({quiz: 'Quiz not found.'}, 404, 'ValidationError')
      quiz.set(data)
      await quiz.save()
      res.body = quiz
    }
  ]
}
