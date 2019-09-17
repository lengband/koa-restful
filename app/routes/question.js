const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, delete: del, checkQuestionExist, checkQuestioner } = require('../controllers/question')
const { secret } = require('../config')

// 认证中间件
const auth = jwt({ secret })

const router = new Router({
  prefix: '/questions'
});

router
  .get('/', find)
  .get('/:id', findById)
  .post('/', auth, create)
  .patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
  .delete('/:id', auth, checkQuestionExist, checkQuestioner, del)

module.exports = router