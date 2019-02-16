const loadRouteConstructor = require('./loadRouteConstructor')
const Router = require('express').Router
const KNOWN_HOSTNAMES = process.env.hostname
let getQuizAppFromHostname = function (hostname) {

}

let loadRoutes = async function ({models = {}}) {
  let apiHelpers = require('./api-helpers')(models)
  let router = new Router()

  router.use((req, res, next) => {
    let quizAppName = getQuizAppFromHostname(req.hostname)
    if (!quizAppName) return next()

  })

  router.param('quizAppId', (req, res, next, id) => {
    models.Application.findById(id, function (err, quizApp) {
      if (err) return next(err)
      req.quizApp = quizApp
      next()
    })
  })

  // API endpoints
  let loadRoute = loadRouteConstructor(router, {models, apiHelpers})
  loadRoute('post', '/login', require('./api/login'))
  loadRoute('post', '/register', require('./api/register'))
  loadRoute('post', '/logout', require('./api/logout'))

  // QUIZ APP
  loadRoute('get', '/quiz-app/:quizAppId', require('./api/quiz-app/retrieve'))
  loadRoute('get', '/quiz-app/', require('./api/quiz-app/list'))
  loadRoute('post', '/quiz-app', require('./api/quiz-app/create'))
  loadRoute('put', '/quiz-app/:quizAppId', require('./api/quiz-app/update'))
  loadRoute('delete', '/quiz-app/:quizAppId', require('./api/quiz-app/delete'))

  loadRoute('get', '/quiz-app/:quizAppId/teachers', require('./api/teachers/list'))
  loadRoute('post', '/quiz-app/:quizAppId/teachers', require('./api/teachers/add-teacher'))
  loadRoute('delete', '/quiz-app/:quizAppId/teachers/:teacherId', require('./api/teachers/remove-teacher'))
  loadRoute('get', '/quiz-app/:quizAppId/quizess', require('./api/quizess/list'))
  loadRoute('get', '/quiz-app/:quizAppId/quizess/:quizId', require('./api/quizess/retrieve'))
  loadRoute('post', '/quiz-app/:quizAppId/quizess', require('./api/quizess/create'))
  loadRoute('put', '/quiz-app/:quizAppId/quizess/:quizId', require('./api/quizess/update'))
  loadRoute('delete', '/quiz-app/:quizAppId/quizess/:quizId', require('./api/quizess/delete'))
  loadRoute('post', '/quiz-app/:quizAppId/quizess/:quizId/publish', require('./api/quizess/publish'))

  return router
}

module.exports = loadRoutes
