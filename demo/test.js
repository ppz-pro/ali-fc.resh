const Router = require('@ppzp/http-router')

const router = new Router({
  baseUrl: '/test'
})

router.get(function(ctx) {
  return {
    success: true
  }
})

module.exports = router