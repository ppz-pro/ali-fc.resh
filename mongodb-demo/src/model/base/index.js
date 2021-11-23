module.exports = class BaseCollection {
  /** @param {import('mongodb').Db} db */
  constructor(db, name) {
    this.__soul = db.collection(name)
  }

  insert(data) {
    date.now = new Date()
    if(data instanceof Array) {
      data.forEach(date)
      return this.__soul.insertMany(data)
    } else {
      date(data)
      return this.__soul.insertOne(data)
    }
  }
}

function date(data) {
  data.u_at = data.c_at = date.now
}