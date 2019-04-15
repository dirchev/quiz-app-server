const _ = require('lodash')

module.exports = function ({models, apiHelpers}) {
  return [
    // apiHelpers.authUser,
    // apiHelpers.authUserForApp,
    async (req, res) => {
      let quizApp = req.quizApp
      let quiz = await models.Quiz.findOne({
        _id: req.params.quizId,
        quizApp: quizApp.id
      })
      let quizEngagements = await models.QuizEngagement.find({
        quiz: quiz._id
      })

      let quizStats = {
        quizName: quiz.name,
        quizDescription: quiz.description,
        questions: []
      }

      for (let question of quiz.questions) {
        let questionItem = {
          questionTitle: question.title,
          questionContent: question.content,
          type: question.type,
          answersGiven: []
        }
        for (let engagement of quizEngagements) {
          let answerGiven = engagement.answersGiven.get(question._id)
          if (question.type === 'MCQ_ONE_RIGHT') {
            answerGiven = _.find(question.answers.options, ({_id}) => _id.toString() === answerGiven)
            answerGiven = answerGiven ? answerGiven.text : null
          }
          if (question.type === 'MCQ_MULTIPLE_RIGHT') {
            answerGiven = (answerGiven || []).map(answerGiven => _.find(question.answers.options, ({_id}) => _id.toString() === answerGiven))
            answerGiven = answerGiven.map(answerGiven => answerGiven ? answerGiven.text : null)
          }
          questionItem.answersGiven.push(answerGiven)
        }
        quizStats.questions.push(questionItem)
      }

      res.body = quizStats
    }
  ]
}
