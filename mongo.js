const { MongoClient } = require('mongodb')
const defaults = require('@ppzp/utils/defaults')
const Context = require('./context')

const BaseCollection = exports.BaseCollection = class {
  /** @param {import('mongodb').Db} db */
  constructor(db, name) {
    this.__soul = db.collection(name)
  }

  insert(data) {
    addTime.now = new Date()
    if(data instanceof Array) {
      data.forEach(addTime)
      return this.__soul.insertMany(data)
    } else {
      addTime(data)
      return this.__soul.insertOne(data)
    }
  }
}

function addTime(data) {
  data.u_at = data.c_at = addTime.now
}

class LogCollection extends BaseCollection {
  debug() {
    return this.write(1, arguments)
  }
  info() {
    return this.write(2, arguments)
  }
  warn() {
    return this.write(3, arguments)
  }
  error() {
    return this.write(4, arguments)
  }

  write(type, args) {
    return this.insert({
      type,
      content: Array.from(args).join('\n')
    })
  }
}

exports.Model = class {
  constructor(options) {
    if(typeof options == 'string')
      options = {
        dbName: options
      }
    options = defaults(options, {
      log: true
    })
    
    const url = process.env.mongo
    this.client = new MongoClient(url)
    
    this.__db = this.client.db(options.dbName)
    if(options.log) {
      const Log = this.Log = new LogCollection(this.__db, 'log')
      Context.prototype.handle404 = async function() {
        await Log.error(`[404] ${this.req.method} ${this.req.path}`)
        this.res.setStatusCode(404)
        this.res.send('404')
      }
      Context.prototype.handle500 = async function(e) {
        await Log.error('服务器内部错误', e)
        this.res.setStatusCode(500)
        this.res.send('500')
      }
    }
  }

  async init() {
    try {
      await this.client.connect()
    } catch(e) {
      // 未建立连接，不能使用 this.Log
      console.error(e)
      throw new Error('mongo 连接建立失败\n' + e)
    }
    if(this.Log) {
      await this.Log.info('mongo 连接建立成功')  
      console.log('日志开始记录到 mongodb 里')
    }
  }
}