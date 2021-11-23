const { MongoClient } = require('mongodb')

const BaseCollection = require('./base')
const LogCollection = require('./log')

class Model {
  constructor() {
    const url = process.env.mongo
    this.client = new MongoClient(url)
    
    const db = this.client.db('mm')
    // 在这里显示声明，繁琐但结构简单
    this.User = new BaseCollection(db, 'user')
    this.Log = new LogCollection(db, 'log')
  }
}

module.exports = new Model()