const Comment = require('../models/comments')

const verifyParams = {
  content: {
    type: 'string',
    required: true
  },
  rootCommentId: {
    type: 'string',
    required: false
  },
  replyTo: {
    type: 'string',
    required: false
  },
}

class CommentCtl {
  // 答案是否存在
  async checkCommentExist (ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if (!comment) ctx.throw(404, '评论不存在')
    // 只有在删改查答案的时候才检查此逻辑，赞和踩不坚持此逻辑
    if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) ctx.throw(404, '该问题下没有此评论')
    if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) ctx.throw(404, '该答案下没有此评论')
    ctx.state.comment = comment
    await next()
  }
  async checkCommenter (ctx, next) {
    const { comment } = ctx.state
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限') // 不是自己的答案不能修改和删除
    }
    await next()
  }
  async find (ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1 // 转换为数字
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q)
    const { rootCommentId } = ctx.query
    const { questionId, answerId } = ctx.params
    ctx.body = await Comment
    .find({content: q, questionId, answerId, rootCommentId }) // .find({ name: '清华大学' }) // 精确匹配
    .limit(perPage).skip(page * perPage)
    .populate('commentator replyTo')
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
    if (!comment) {
      ctx.throw(404, '答案不存在')
    } else {
      ctx.body = comment
    }
  }
  async create (ctx) {
    ctx.verifyParams(verifyParams)
    const { questionId, answerId } = ctx.params
    const comment = await new Comment({ ...ctx.request.body, commentator: ctx.state.user._id, questionId, answerId }).save()
    ctx.body = comment
  }
  async update (ctx) {
    ctx.verifyParams(verifyParams)
    const { content } = ctx.request.content
    await ctx.state.comment.update({ content })
    ctx.body = ctx.state.comment
  }
  async delete (ctx) {
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new CommentCtl()