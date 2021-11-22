const Router = require('@ppzp/http-router')

const router = new Router({
  baseUrl: '/user'
})

router.get(function() {
  return {
    success: '/user'
  }
})

module.exports = router