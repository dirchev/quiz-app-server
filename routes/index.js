const loadRouteConstructor = require('./loadRouteConstructor')

let routes = async function ({app, models = {}}) {
  let apiHelpers = require('./api-helpers')(models)

  // API endpoints
  let loadRoute = loadRouteConstructor(app, {models, apiHelpers})
  loadRoute('post', '/api/login', require('./api/login'))
  loadRoute('post', '/api/register', require('./api/register'))
  loadRoute('post', '/api/logout', require('./api/logout'))

  // QUIZ APP
  loadRoute('get', '/api/quiz-app/:quizAppId', require('./api/quiz-app/retrieve'))
  loadRoute('get', '/api/quiz-app/', require('./api/quiz-app/list'))
  loadRoute('post', '/api/quiz-app', require('./api/quiz-app/create'))
  loadRoute('put', '/api/quiz-app/:quizAppId', require('./api/quiz-app/update'))
  loadRoute('delete', '/api/quiz-app/:quizAppId', require('./api/quiz-app/delete'))

  loadRoute('get', '/api/quiz-app/:quizAppId/teachers', require('./api/quiz-app/teachers/list'))
  loadRoute('post', '/api/quiz-app/:quizAppId/teachers', require('./api/quiz-app/teachers/add-teacher'))
  loadRoute('delete', '/api/quiz-app/:quizAppId/teachers/:teacherId', require('./api/quiz-app/teachers/remove-teacher'))

  loadRoute('get', '/api/quiz-app/:quizAppId/quizess', require('./api/quiz-app/quizess/list'))
  loadRoute('get', '/api/quiz-app/:quizAppId/quizess/:quizId', require('./api/quiz-app/quizess/retrieve'))
  loadRoute('post', '/api/quiz-app/:quizAppId/quizess', require('./api/quiz-app/quizess/create'))
  loadRoute('put', '/api/quiz-app/:quizAppId/quizess/:quizId', require('./api/quiz-app/quizess/update'))
  loadRoute('delete', '/api/quiz-app/:quizAppId/quizess/:quizId', require('./api/quiz-app/quizess/delete'))
  loadRoute('post', '/api/quiz-app/:quizAppId/quizess/:quizId/publish', require('./api/quiz-app/quizess/publish'))
}

module.exports = routes
