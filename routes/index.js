const loadRouteConstructor = require('./loadRouteConstructor')
const Router = require('express').Router

let loadRoutes = async function ({models = {}}) {
  let apiHelpers = require('./api-helpers')(models)
  let router = new Router()

  router.use((req, res, next) => {
    if (req.hostname.indexOf(process.env.HOSTNAME) === -1) return next()
    let quizAppSubdomain = req.hostname.split('.').shift()
    if (!quizAppSubdomain) return next()
    models.Application.findOne({subdomain: quizAppSubdomain}).select('-joinCode').then(function (quizApp) {
      req.quizApp = quizApp
      req.isUsingSubDomain = true
      next()
    }).catch(next)
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
  loadRoute('get', '/load', require('./api/quiz-app/load'))
  loadRoute('get', '/quiz-app/:quizAppId', require('./api/quiz-app/retrieve'))
  loadRoute('get', '/quiz-app/', require('./api/quiz-app/list'))
  loadRoute('post', '/quiz-app', require('./api/quiz-app/create'))
  loadRoute('put', '/quiz-app/:quizAppId', require('./api/quiz-app/update'))
  loadRoute('delete', '/quiz-app/:quizAppId', require('./api/quiz-app/delete'))

  let teachersRouter = new Router()
  let loadTeachersRoute = loadRouteConstructor(teachersRouter, {models, apiHelpers})
  loadTeachersRoute('get', '/', require('./api/teachers/list'))
  loadTeachersRoute('post', '/', require('./api/teachers/add-teacher'))
  loadTeachersRoute('delete', '/:teacherId', require('./api/teachers/remove-teacher'))
  router.use('/teachers', teachersRouter)
  router.use('/quiz-app/:quizAppId/teachers', teachersRouter)

  let quizessRouter = new Router()
  let loadQuizessRoute = loadRouteConstructor(quizessRouter, {models, apiHelpers})
  loadQuizessRoute('get', '/', require('./api/quizess/list'))
  loadQuizessRoute('get', '/:quizId', require('./api/quizess/retrieve'))
  loadQuizessRoute('post', '/', require('./api/quizess/create'))
  loadQuizessRoute('put', '/:quizId', require('./api/quizess/update'))
  loadQuizessRoute('delete', '/:quizId', require('./api/quizess/delete'))
  loadQuizessRoute('post', '/:quizId/publish', require('./api/quizess/publish'))
  loadQuizessRoute('get', '/:quizId/prepare', require('./api/quizess/prepare'))

  let quizEngagementsRouter = new Router()
  let loadQuizEngagementsRoute = loadRouteConstructor(quizEngagementsRouter, {models, apiHelpers})
  loadQuizEngagementsRoute('post', '/', require('./api/quiz-engagements/create'))
  loadQuizEngagementsRoute('get', '/:quizId/', require('./api/quiz-engagements/list'))
  loadQuizEngagementsRoute('post', '/:quizEngagementId/finish', require('./api/quiz-engagements/finish'))
  loadQuizEngagementsRoute('put', '/:quizEngagementId', require('./api/quiz-engagements/update-answers'))

  router.use('/quizess', quizessRouter)
  router.use('/quiz-app/:quizAppId/quizess', quizessRouter)
  router.use('/quiz-engagements', quizEngagementsRouter)

  return router
}

module.exports = loadRoutes
