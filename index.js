const Router = require('@ppzp/http-router')
const defaults = require('lodash/defaults')
const bindAll = require('lodash/bindAll')
const Context = require('./context')
const returnData = require('./breads/return-data')

module.exports = class ReshAliFC {
  constructor(options) {
    options = defaults(options, {
      Context,
      breads: [],
      returnData: true,
    })
    
    if(options.returnData)
      options.breads.unshift(returnData)
    this.__init = options.init
    this.__Context = options.Context

    this.router = new Router(options)

    if(options.controllers)
      this.router.setChildren(options.controllers)

    bindAll(this, [
      'handler', 'initializer'
    ])
  }

  handler(req, res, aliContext) {
    const $ = new this.__Context(req, res, aliContext)
    const handler = this.router.getHandler(req.method, req.path)
    if(handler)
      try {
        handler($)
      } catch(e) {
        $.handle500(res, e)
      }
    else
      $.handle404(res)
  }

  async initializer(aliContext, callback) {
    if(this.__init)
      await this.__init()
    this.router.makeSandwich()

    callback(null)
  }
}