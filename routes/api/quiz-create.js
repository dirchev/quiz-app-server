module.exports = function ({models, apiHelpers}) {
  return [
    async (req, res) => {
      // TODO auth user
      let user = await models.User.findOne({role: User.USER_ROLES.TEACHER})

      // TODO joi validate
      let data = {
        name: req.body.name,
        subdomain: req.body.subdomain,
        description: req
      }
      let application = new models.Application({
        name: data.name,
        subdomain: data.subdomain,
        description: data.description,
        teachers: [
          user.id
        ]
      })
      await application.save()
      res.body = application.toJSON()
    }
  ]
}
