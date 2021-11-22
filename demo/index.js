const App = require('@ppzp/resh-alifc')

const app = new App({

})

app.router.setChildren([
  require('./test')
])

module.exports = app