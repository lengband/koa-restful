const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, del, login, checkOwner, listFollowing, follow, unfollow, listFollowers, checkUserExist } = require('../controllers/users')
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
  .get('/', find)
  .get('/:id', findById)
  .get('/:id/following', listFollowing)
  .get('/:id/followers', listFollowers)
  .post('/', create)
  .post('/login', login)
  .delete('/:id', auth, checkOwner, del)
  .delete('/following/:id', auth, checkUserExist, unfollow)
  .patch('/:id', auth, checkOwner, update)
  .put('/following/:id', auth, checkUserExist, follow)

module.exports = router