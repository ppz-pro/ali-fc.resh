module.exports = class Context {
  constructor(req, res, aliContext) {
    this.req = req
    this.res = res
    this.ali = aliContext
  }

  responseJson(data) {
    this.res.setHeader('Content-type', 'application/json')
    this.res.send(JSON.stringify(data))
  }

  handle404() {
    console.error(`[404] ${this.req.method} ${this.req.path}`)
    this.res.setStatusCode(404)
    this.res.send('404')
  }

  handle500(e) {
    console.error('服务器内部错误')
    console.error(e)
    this.res.setStatusCode(500)
    this.res.send('500')
  }
}