const Koa = require('koa');
const koaBody = require('koa-body');
const koaError = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')

const routing = require('./routes')
const { connectStr } = require('./config')

mongoose.connect(connectStr, { useNewUrlParser: true }, () => {
  console.log('连接成功')
})

mongoose.connection.on('error', console.error)

const app = new Koa();

app.use(parameter(app))
app.use(koaError({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : ({ stack, ...rest })
}))

app.use(koaBody({
  multipart: true, // 启用文件上传
  formidable: {
    uploadDir: path.join(__dirname, './public/uploads'),
    keepExtensions: true // 写入uploadDir的文件将包含原文件的扩展名
  }
}));
routing(app)

app.listen(5000, () => console.log('listen at 5000'));