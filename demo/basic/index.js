const App = require('@ppzp/resh-alifc')

const app = new App()
app.controller.get('/test', function() {
  return {
    success: true
  }
})

module.exports = app