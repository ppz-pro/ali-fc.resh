const Router = require('@ppzp/http-router')
const Context = require('./context')
const returnData = require('./breads/return-data')
const { defaults, bind, promiseAll } = require('@ppzp/utils')

module.exports = class ReshAliFC {
  constructor(options) {
    options = defaults(options, {
      returnData: true,
      breads: [],
      onInit: [],
      Context,
    })
    
    if(options.returnData)
      options.breads.unshift(returnData)
    this.__onInit = options.onInit
    this.__Context = options.Context || Context

    this.router = new Router(options)
    if(options.controllers)
      this.router.setChildren(options.controllers)

    if(options.model)
    this.onInit(function() {
      return options.model.init()
    })

    bind(this, 'handler', 'initializer')
  }

  onInit(cb) {
    this.__onInit.push(cb)
  }

  async handler(req, res, aliContext) {
    const $ = new this.__Context(req, res, aliContext)
    const handler = this.router.getHandler(req.method, req.path)
    if(handler)
      try {
        await handler($)
      } catch(e) {
        $.handle500(e)
      }
    else
      $.handle404()
  }

  async initializer(aliContext, callback) {
    try {
      await promiseAll(this.__onInit)
      this.router.makeSandwich()
      callback()
    } catch(e) {
      console.error('初始化出现异常')
      callback(e)
    }
  }
}