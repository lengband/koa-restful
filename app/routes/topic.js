const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, del } = require('../controllers/topics')
const { secret } = require('../config')

// 认证中间件
const auth = jwt({ secret })

const router = new Router({
  prefix: '/topics'
});

router
  .get('/', find)
  .get('/:id', findById)
  .post('/', auth, create)
  .patch('/:id', auth, update)
  .del('/:id', auth, del)

module.exports = router