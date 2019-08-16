const User = require('../models/users')

const verifyParams = {
  name: {
    type: 'string',
    required: true
  },
  age: {
    type: 'number',
    required: false
  }
}

class UserCtl {
  async find (ctx) {
    ctx.body = await User.find()
  }
  async findById (ctx) {
    const user = await User.findById(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    else ctx.body = user
  }
  async create (ctx) {
    ctx.verifyParams(verifyParams)
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async update (ctx) {
    ctx.verifyParams(verifyParams)
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async del (ctx) {
    const user = await User.findByIdAndDelete(ctx.params.id)
    ctx.body = user
  }
}

module.exports = new UserCtl()