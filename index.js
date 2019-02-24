require('dotenv').config()
const initServer = require('./server')

const execute = async () => {
  let server = await initServer()
  process.on('SIGTERM', function () {
    server.close()
  })
}

execute().catch((err) => {
  console.error(err)
  process.exit(1)
})
