const { MongoClient } = require('mongodb')
const defaults = require('@ppzp/utils/defaults')

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
    if(options.log)
      this.Log = new LogCollection(this.__db, 'log')
  }

  async init() {
    try {
      await this.client.connect()
      if(this.Log)
        this.Log.info('mongo 连接建立成功')
        .then(() => {
          console.log('日志开始记录到 mongodb 里')
        })
    } catch(e) {
      // 未建立连接，不能使用 this.Log
      console.error('mongo 连接建立失败')
      console.error(e)
    }
  }
}