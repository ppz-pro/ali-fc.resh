const { Model, BaseCollection } = require('@ppzp/resh-alifc/mongo')

const model = new Model('mm')
// 显示地添加模型，繁琐但结构简单
model.User = new BaseCollection(model.__db, 'user')

module.exports = model