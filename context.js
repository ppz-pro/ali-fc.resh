module.exports = class Context {
  constructor(req, res, aliContext) {
    this.req = req
    this.res = res
    this.ali = aliContext
  }

  async getJson() {
    if(this.__json)
      return this.__json
    return new Promise(resolve => {
      const success = data => {
        this.__json = data
        resolve(data)
      }
      const fail = err => {
        console.error('解析请求里的 json 时，发生异常')
        console.error(err)
        success({})
      }
      
      let str = ''
      this.req.on('data', chunk => {
        str += chunk
      })
      this.req.on('end', () => {
        try {
          success(JSON.parse(str))
        } catch(e) {
          fail(e)
        }
      })
      this.req.on('error', fail)
    })
  }

  getParams() { // 保持跟 resh 一样的 api
    return this.req.queries
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