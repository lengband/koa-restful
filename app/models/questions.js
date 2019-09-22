const mongoose = require('mongoose')

const { Schema, model } = mongoose

const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String },
  questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
  topics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false,
  }
}, {
  timestamps: true, // 将自动添加 createAt 和 updateAt 两个字段
})

module.exports = model('Question', questionSchema)
