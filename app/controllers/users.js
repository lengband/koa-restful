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
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1 // 转换为数字
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await User
    .find({ name: new RegExp(ctx.query.q) })
    .limit(perPage).skip(perPage * page)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const populateStr = fields.split(';').filter(f => f).map(f => {
      if (f === 'employments') {
        return 'employments.company employment.job'
      }
      if (f === 'educations') {
        return 'educations.school educations.major'
      }
      return f
    }).join(' ')
    const user = await User.findById(ctx.params.id).select(selectFields)
      .populate(populateStr)
    if (!user) {
      ctx.throw(404, '用户不存在')
    } else {
      ctx.body = user
    }
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
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      headline: {
        type: 'string',
        required: false
      },
      locations: {
        type: 'array',
        itemType: 'string',
        required: false
      },
      business: {
        type: 'string',
        required: false
      },
      employments: {
        type: 'array',
        itemType: 'object',
        required: false
      },
      educations: {
        type: 'array',
        itemType: 'object',
        required: false
      },
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
  async listFollowing (ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.following
  }
  async listFollowers (ctx) { // 粉丝list
    const user = await User.find({ following: ctx.params.id })
    ctx.body = user
  }
  async checkUserExist (ctx, next) { // 中间件，检查 params.id 是否存在
    const user = await User.findById(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    await next()
  }
  async follow (ctx) { // 关注
    const me = await User.findById(ctx.state.user._id).select('+following') // 登录人的关注者列表
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 200
  }
  async followTopic (ctx) { // 关注话题
    const me = await User.findById(ctx.state.user._id).select('+followingTopics') // 登录人的关注者列表
    if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id)
      me.save()
    }
    ctx.status = 200
  }
  async listFollowingTopics (ctx) { // 用户关注话题列表
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.followingTopics
  }
  async unfollow (ctx) { // 取消关注
    const me = await User.findById(ctx.state.user._id).select('+following') // 登录人的关注者列表
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  async unfollowTopic (ctx) { // 取消关注话题
    const me = await User.findById(ctx.state.user._id).select('+followingTopics') // 登录人的关注者列表
    const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.followingTopics.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
}

module.exports = new UserCtl()