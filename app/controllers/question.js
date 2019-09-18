const Question = require('../models/questions')

const verifyParams = {
  title: {
    type: 'string',
    required: true
  },
  description: {
    type: 'string',
    required: false
  },
}

class QuestionCtl {
  // 问题是否存在
  async checkQuestionExist (ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    ctx.state.question = question
    if (!question) ctx.throw(404, '问题不存在')
    await next()
  }
  async checkQuestioner (ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限') // 不是自己的问题不能修改和删除
    }
    await next()
  }
  async find (ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1 // 转换为数字
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Question
    .find({ $or: [{ title: q }, { description: q }] }) // .find({ name: '清华大学' }) // 精确匹配
    .limit(perPage).skip(page * perPage)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
    if (!question) {
      ctx.throw(404, '问题不存在')
    } else {
      ctx.body = question
    }
  }
  async create (ctx) {
    ctx.verifyParams(verifyParams)
    const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id }).save()
    ctx.body = question
  }
  async update (ctx) {
    ctx.verifyParams(verifyParams)
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }
  async delete (ctx) {
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new QuestionCtl()