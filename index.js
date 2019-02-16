const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var cors = require('cors')
const loadRoutes = require('./routes/index.js')
const loadModels = require('./models/index.js')

const execute = async () => {
  const app = express()
  app.enable("trust proxy")
  app.use(cookieParser())
  app.use(cors())
  app.use(bodyParser.json())

  let models = loadModels()
  let router = await loadRoutes({models})
  app.use('/api', router)

  const port = 8080
  app.listen(port, () => console.log(`Web Service listening on port ${port}!`))
}

execute().catch((err) => {
  console.error(err)
  process.exit(1)
})
