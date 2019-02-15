const Joi = require('joi')

module.exports = function ({models, apiHelpers}) {
  let schema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
  return [
    async (req, res) => {
      let data = await Joi.validate({
        email: req.body.email,
        password: req.body.password,
      }, schema)
      let user = await models.User.findByCredentials(data)
      if (!user) {
        let error = apiHelpers.createFieldError('base', 'email and password combination is not valid')
        throw error
      }
      let token = await user.generateToken()
      res.body = {
        user: user.toJSON(),
        token: token
      }
    }
  ]
}
