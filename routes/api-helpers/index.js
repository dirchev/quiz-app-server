module.exports = (models) => {
  let authUser = async function (req, res) {
    let token = req.headers['authtoken']
    req.user = await models.User.findByToken(token)
    if (!req.user) throw createError({base: 'Access denied.'}, 403, 'ValidationError')
  }

  let authUserForApp = async function (req, res) {
    let user = req.user
    let quizAppId = req.params.quizAppId
    req.quizApp = await models.Application.findOne({
      _id: quizAppId,
      teachers: user.id,
    })
    if (!req.quizApp) throw createError({quizApp: 'Application not found.'}, 404, 'ValidationError')
  }

  let authOwnerForApp = async function (req, res) {
    let user = req.user
    let quizAppId = req.params.quizAppId
    req.quizApp = await models.Application.findOne({
      _id: quizAppId,
      owner: user.id,
    })
    if (!req.quizApp) throw createError({quizApp: 'Application not found.'}, 404, 'ValidationError')
  }

  let createError = function (errors, code, name = 'CustomError') {
    let error = new Error(name)
    error.name = name
    error.isCustomError = true
    error.code = code
    error.errors = errors
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
    authUserForApp,
    authOwnerForApp,
    createFieldError,
    createError,
  }
}
