/**
 * 接收 handler 的 return，并且以 json 格式相应给前端
 * @param {import('../context')} ctx 
 */
async function returnData(vege, ctx) {
  const data = await vege(ctx)
  if(!data)
    throw Error('未响应的请求')
  if(data != Returned)
    ctx.responseJson(data)
}

const Returned = returnData.Returned = Symbol('returned')

module.exports = returnData