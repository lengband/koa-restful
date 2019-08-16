const Router = require('koa-router');
const { find, findById, create, update, del } = require('../controllers/users')

const router = new Router({
  prefix: '/users'
});

router
  .get('/', find)
  .post('/', create)
  .put('/:id', update)
  .del('/:id', del)
  .get('/:id', findById);

module.exports = router