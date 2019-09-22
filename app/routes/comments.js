const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, delete: del, checkCommentExist, checkCommenter } = require('../controllers/comments')
const { secret } = require('../config')

// 认证中间件
const auth = jwt({ secret })

const router = new Router({
  prefix: '/questions/:questionId/answer/answerId/comments'
});

router
  .get('/', find)
  .get('/:id', findById)
  .post('/', auth, create)
  .patch('/:id', auth, checkCommentExist, checkCommenter, update)
  .delete('/:id', auth, checkCommentExist, checkCommenter, del)

module.exports = router