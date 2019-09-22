const mongoose = require('mongoose')

const { Schema, model } = mongoose

const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false }, // 评论人
  questionId: { type: String, required: true }, // 记录评论从属于哪个问题
  answerId: { type: String, required: true }, // 记录评论从属于哪个回答
})

module.exports = model('Comment', commentSchema)
