const Base = require('./base')

module.exports = class LogCollection extends Base {
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
    this.insert({
      type,
      content: Array.from(args).join('\n')
    })
  }
}