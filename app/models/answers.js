const mongoose = require('mongoose')

const { Schema, model } = mongoose

const answerSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
  questionId: { type: String, required: true }, // 记录答案从属于哪个问题
  voteCount: { type: Number, required: true, default: 0 } // 投票数
}, {
  timestamps: true, // 将自动添加 createAt 和 updateAt 两个字段
})

module.exports = model('Answer', answerSchema)
