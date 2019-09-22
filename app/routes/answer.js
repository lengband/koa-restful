const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, delete: del, checkAnswerExist, checkAnswerer } = require('../controllers/answer')
const { secret } = require('../config')

// 认证中间件
const auth = jwt({ secret })

const router = new Router({
  prefix: '/questions/:questionId/answer'
});

router
  .get('/', find)
  .get('/:id', findById)
  .post('/', auth, create)
  .patch('/:id', auth, checkAnswerExist, checkAnswerer, update)
  .delete('/:id', auth, checkAnswerExist, checkAnswerer, del)

module.exports = router