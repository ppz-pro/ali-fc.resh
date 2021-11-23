const Router = require('@ppzp/http-router')
const { User } = require('../model/index')

const router = new Router({
  baseUrl: '/user'
})

router.get(async function() {
  return await User.__soul.find()
})

module.exports = router