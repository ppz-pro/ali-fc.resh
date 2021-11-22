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

  handle404(res) {
    res.setStatusCode(404)
    res.send('404')
  }
  
  handle500(res, e) {
    console.error('服务器内部错误')
    console.error(e)
    res.setStatusCode(500)
    res.send('500')
  }
}