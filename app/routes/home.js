const Router = require('koa-router');
const router = new Router();
const { index, upload } = require('../controllers/home');

router
  .get('/', index)
  .post('/upload', upload)

module.exports = router