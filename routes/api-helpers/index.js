module.exports = (models) => {
  let authUser = async function (req, res) {
    let token = req.headers['authtoken']
    req.user = await models.User.findByToken(token)
    if (!req.user) throw createError('base', 'Access denied.', 403, 'ValidationError')
  }

  let authUserForApp = async function (req, res) {
    let user = req.user
    if (!req.quizApp) throw createError('base', 'Operation not allowed', 403, 'ValidationError')
    let hasAccess = false
    if (req.user.role === models.User.USER_ROLES.STUDENT) {
      hasAccess = req.quizApp.hasStudent(user.id)
    } else if (req.user.role === models.User.USER_ROLES.TEACHER) {
      hasAccess = req.quizApp.hasTeacher(user.id)
    }
    if (!hasAccess) throw createError('base', 'Operation not allowed', 403, 'ValidationError')
  }

  let authStudent = async function (req, res) {
    if (req.user.role !== models.User.USER_ROLES.STUDENT) throw createError('base', 'Operation not allowed', 403, 'ValidationError')
  }

  let authTeacher = async function (req, res) {
    if (req.user.role !== models.User.USER_ROLES.TEACHER) throw createError('base', 'Operation not allowed', 403, 'ValidationError')
  }

  let authOwnerForApp = async function (req, res) {
    let user = req.user
    let quizApp = req.quizApp
    if (!quizApp.owner.equals(user.id)) throw createError('base', 'Operation not allowed', 403, 'ValidationError')
  }

  let createError = function (field, message, code, name = 'CustomError') {
    let error = new Error(name)
    error.name = name
    error.isCustomError = true
    error.code = code
    error.errors = {}
    error.errors[field] = {
      message: message,
      name: 'ValidationError',
      path: field,
    }
    return error
  }

  let createFieldError = function (field, message, value, kind) {
    let error = new Error('ValidationError: ' + message)
    error.name = 'ValidationError'
    error.isCustomError = true
    error.code = 422
    error.errors = {}
    error.errors[field] = {
      message: message,
      name: 'ValidationError',
      path: field,
      value: value,
      kind: kind
    }
    return error
  }

  return {
    authUser,
    authStudent,
    authTeacher,
    authUserForApp,
    authOwnerForApp,
    createFieldError,
    createError,
  }
}
