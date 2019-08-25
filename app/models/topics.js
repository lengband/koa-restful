const mongoose = require('mongoose')

const { Schema, model } = mongoose

const topicSchema = new Schema({
  __v: {
    type: Number,
    select: false // 隐藏字段
  },
  name: {
    type: String,
    required: true,
  },
  avatar_url: { // 头像
    type: String,
  },
  introduction: { // 话题简介
    type: String,
    select: false
  },
})

module.exports = model('Topic', topicSchema);