let errorsResponder = function (err, req, res, next) {
  let errorToSendBack = err
  let statusCode = 500
  if (err.isJoi) {
    errorToSendBack = {
      name: 'RequestDataError',
      errors: err.details.map((i) => ({
        message: i.message,
        path: i.path.join('.')
      }))
    }
    statusCode = 422
  } else if (err.name === 'ValidationError') {
    errorToSendBack = {
      name: 'ValidationError',
      errors: Object.keys(err.errors).map((key) => ({
        message: err.errors[key].message,
        path: key
      }))
    }
    statusCode = err.code || 422
  } else if (err.isCustomError) {
    errorToSendBack = err
    statusCode = err.code
  } else {
    console.error(err)
    errorToSendBack = {
      name: 'UnexpectedError'
    }
  }
  res.status(statusCode).json(errorToSendBack)
  next()
}

module.exports = errorsResponder
