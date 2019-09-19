const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, del, login, checkOwner, listFollowing, follow, unfollow, listFollowers, checkUserExist, followTopic, unfollowTopic, listFollowingTopics, listQuestions, listLikingAnwers, likeAnswer, unlikeAnswer, listdisLikingAnwers, dislikeAnswer, undislikeAnswer, listCollectingAnwers, collectAnswer, uncollectAnswer } = require('../controllers/users')
const { checkTopicExist } = require('../controllers/topics')
const { checkAnswerExist } = require('../controllers/answer')
const { secret } = require('../config')

// 认证中间件
const auth = jwt({ secret })

// 自己实现
// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jsonwebtoken.verify(token, secret)
//     jsonwebtoken.verify(token, secret, function(err, decoded) {
//       console.log(decoded) // bar
//     })
//     ctx.state.user = user
//   } catch (error) {
//     ctx.throw(401, error.message) // jsonwebtoken 验证失败应该返回 401
//   }
//   await next()
// }

const router = new Router({
  prefix: '/users'
});

router
  .get('/', find) // 用户列表
  .get('/:id', findById) // 用户详情
  .get('/:id/following', listFollowing) // 关注列表
  .get('/:id/followingTopics', listFollowingTopics) // 关注话题列表
  .get('/:id/likingAnswers', listLikingAnwers) // 点赞答案列表
  .get('/:id/dislikingAnswers', listdisLikingAnwers) // 踩答案列表
  .get('/:id/collectingAnswers', listCollectingAnwers) // 收藏答案列表
  .get('/:id/followers', listFollowers) // 粉丝列表
  .get('/:id/questions', listQuestions) // 问题列表
  .post('/', create) // 创建
  .post('/login', login) // 登录
  .put('/following/:id', auth, checkUserExist, follow) // 关注
  .put('/followingTopics/:id', auth, checkTopicExist, followTopic) // 关注话题
  .put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer) // 点赞答案(并取消踩答案)
  .put('/dislikingAnswers/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer) // 踩答案(并取消点赞答案)
  .put('/collectingAnswers/:id', auth, checkAnswerExist, collectAnswer) // 收藏答案
  .delete('/:id', auth, checkOwner, del) // 删除
  .delete('/following/:id', auth, checkUserExist, unfollow) // 取消关注
  .delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic) // 取消关注话题
  .delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer) // 取消点赞答案
  .delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer) // 取消踩答案
  .delete('/collectingAnswers/:id', auth, checkAnswerExist, uncollectAnswer) // 取消收藏答案
  .patch('/:id', auth, checkOwner, update) // 修改
  
module.exports = router