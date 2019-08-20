const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const { secret } = require('../config')

const verifyParams = {
  name: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
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
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) ctx.throw(409, '用户已经存在')
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  // 授权中间件
  async checkOwner (ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  async update (ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: false
      }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async del (ctx) {
    const user = await User.findByIdAndDelete(ctx.params.id)
    ctx.body = user
  }
  async login (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名或密码不正确')
    const { _id, name } = user
    const token = jsonwebtoken.sign({
      _id,
      name
    }, secret, {
      expiresIn: '1d'
    })
    ctx.body = { token }
  }
}

module.exports = new UserCtl()