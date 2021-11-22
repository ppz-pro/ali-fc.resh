const App = require('@ppzp/resh-alifc')
const UserController = require('./controller/user')

const app = new App()
app.router.setChildren([
  UserController
])

module.exports = app