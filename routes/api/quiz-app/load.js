module.exports = function ({models, apiHelpers}) {
  return [
    async (req, res) => {
      if (!req.quizApp) throw apiHelpers.createError('base', 'Quiz app not found', 404)
      res.body = req.quizApp
    }
  ]
}
