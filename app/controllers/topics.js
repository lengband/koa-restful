const Topic = require('../models/topics')
const User = require('../models/users')

const verifyParams = {
  name: {
    type: 'string',
    required: true
  },
  avatar_url: {
    type: 'string',
    required: false
  },
  introduction: { // 话题简介
    type: 'string',
    required: false
  },
}


class TopicsCtl {
  // 话题是否存在
  async checkTopicExist (ctx, next) {
    const topic = await Topic.findById(ctx.params.id)
    if (!topic) ctx.throw(404, '话题不存在')
    await next()
  }
  async find (ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1 // 转换为数字
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await Topic
    .find({ name: new RegExp(ctx.query.q) }) // .find({ name: '清华大学' }) // 精确匹配
    .limit(perPage).skip(page * perPage)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    if (!topic) {
      ctx.throw(404, '话题不存在')
    } else {
      ctx.body = topic
    }
  }
  async create (ctx) {
    ctx.verifyParams(verifyParams)
    const { name } = ctx.request.body
    const repeatedTopic = await Topic.findOne({ name })
    if (repeatedTopic) ctx.throw(409, '用户已经存在')
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  async update (ctx) {
    ctx.verifyParams(Object.assign({}, verifyParams, { name: { type: 'string', required: false } }))
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!topic) ctx.throw(404, '用户不存在')
    ctx.body = topic
  }
  async del (ctx) {
    // const topic = await Topic.findByIdAndDelete(ctx.params.id)
    ctx.body = '暂不开放删除话题功能'
  }
  async listTopicFollowers (ctx) { // 话题粉丝list
    const user = await User.find({ followingTopics: ctx.params.id })
    ctx.body = user
  }
}

module.exports = new TopicsCtl()