const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var cors = require('cors')
const loadRoutes = require('./routes/index.js')
const loadModels = require('./models/index.js')

module.exports = async function () {
  const app = express()
  app.enable("trust proxy")
  app.use(cookieParser())
  app.use(cors())
  app.use(bodyParser.json())

  let models = loadModels()
  let router = await loadRoutes({models})
  app.use('/api', router)

  const port = process.env.PORT || 8080
  return app.listen(port)
}
