const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, del, listTopicFollowers, checkTopicExist } = require('../controllers/topics')
const { secret } = require('../config')

// 认证中间件
const auth = jwt({ secret })

const router = new Router({
  prefix: '/topics'
});

router
  .get('/', find)
  .get('/:id', findById)
  .get('/:id/followers', checkTopicExist, listTopicFollowers)  // 关注该话题的人
  .post('/', auth, create)
  .patch('/:id', auth, checkTopicExist, update)
  .del('/:id', auth, checkTopicExist, del)

module.exports = router