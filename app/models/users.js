const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: {
    type: Number,
    select: false // 隐藏字段
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  avatar_url: { // 头像
    type: String,
  },
  gender: { // 性别
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true
  },
  headline: { // 一句话介绍
    type: String,
  },
  locations: { // 居住地
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    ref: 'Topic',
    select: false,
  },
  business: { // 所在行业
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    select: false,
  },
  employments: { // 职业经历
    type: [{
      company: { type: Schema.Types.ObjectId, ref: 'Topic' },
      job: { type: Schema.Types.ObjectId, ref: 'Topic' }
    }],
    select: false,
  },
  educations: { // 教育经历
    type: [{
      school: { type: Schema.Types.ObjectId, ref: 'Topic' },
      major: { type: Schema.Types.ObjectId, ref: 'Topic' }, // 专业
      diploma: { type: Number, enum: [1, 2, 3, 4, 5] }, // 学历 1：高中及以下 2：大专 3：本科 4：硕士 5：博士及以上
      entrance_year: { type: Number }, // 入学年份
      graduation_year: { type: Number }, // 毕业年份
    }],
    select: false,
  },
  following: { // 关注
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    select: false,
  },
  followingTopics: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Topic',
    }],
    select: false
  },
  likingAnswers: { // 用户赞过的答案👍
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer',
    }],
    select: false
  },
  dislikingAnswers: { // 用户踩过的答案👎
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer',
    }],
    select: false
  }
})

module.exports = model('User', userSchema);