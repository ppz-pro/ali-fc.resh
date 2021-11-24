const App = require('@ppzp/resh-alifc')
const model = require('./model')

const app = new App({
  model
})

app.router.post('/user', async () =>
  model.User.insert({
    name: 'ppz',
    tel: 1762
  })
)

module.exports = app