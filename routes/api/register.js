const Joi = require('joi')

module.exports = function ({models, apiHelpers}) {
  let schema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
  return [
    async (req, res) => {
      let data = await Joi.validate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }, schema)
      data.role = models.User.USER_ROLES.TEACHER
      let user = await models.User.create(data)
      await user.save()
      res.body = {success: true}
    }
  ]
}
