const Joi = require('joi')

module.exports = function ({models, apiHelpers}) {
  return [
    async (req, res) => {
      let quizApp = req.quizApp
      res.body = {
        "short_name": quizApp.name,
        "name": quizApp.name,
        "display": "fullscreen",
        "icons": [
          {
            "src": "logo/64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "logo/90.png",
            "sizes": "90x90",
            "type": "image/png"
          },
          {
            "src": "logo/128.png",
            "sizes": "128x128",
            "type": "image/png"
          },
          {
            "src": "logo/256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "logo/512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
        "start_url": ".",
        "theme_color": "#1E88E5",
        "background_color": "#ffffff"
      }
    }
  ]
}
