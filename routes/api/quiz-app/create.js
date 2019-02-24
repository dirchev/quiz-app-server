module.exports = function ({models, apiHelpers}) {
  return [
    apiHelpers.authUser,
    async (req, res) => {
      let user = req.user
      let data = {
        name: req.body.name,
        subdomain: req.body.subdomain,
        description: req.body.description,
        joinCode: req.body.joinCode,
      }
      let application = new models.Application({
        name: data.name,
        subdomain: data.subdomain,
        description: data.description,
        owner: user.id,
        joinCode: data.joinCode,
        teachers: [
          user.id
        ]
      })
      await application.save()
      res.body = application.toJSON()
    }
  ]
}
