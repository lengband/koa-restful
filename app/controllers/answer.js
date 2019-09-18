const answer = require('../models/answers')

const verifyParams = {
  content: {
    type: 'string',
    required: true
  },
}

class AnswerCtl {
  // 答案是否存在
  async checkAnswerExist (ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (!answer) ctx.throw(404, '答案不存在')
    // 只有在删改查答案的时候才检查此逻辑，赞和踩不坚持此逻辑
    if (answer.questionId && answer.questionId !== ctx.params.questionId) ctx.throw(404, '该问题下没有此答案')
    ctx.state.answer = answer
    await next()
  }
  async checkAnswerer (ctx, next) {
    const { answer } = ctx.state
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限') // 不是自己的答案不能修改和删除
    }
    await next()
  }
  async find (ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1 // 转换为数字
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Answer
    .find({content: q, questionId: ctx.params.questionId }) // .find({ name: '清华大学' }) // 精确匹配
    .limit(perPage).skip(page * perPage)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
    if (!answer) {
      ctx.throw(404, '答案不存在')
    } else {
      ctx.body = answer
    }
  }
  async create (ctx) {
    ctx.verifyParams(verifyParams)
    const answer = await new answer({ ...ctx.request.body, answerer: ctx.state.user._id, questionId: ctx.params.questionId }).save()
    ctx.body = answer
  }
  async update (ctx) {
    ctx.verifyParams(verifyParams)
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }
  async delete (ctx) {
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new AnswerCtl()