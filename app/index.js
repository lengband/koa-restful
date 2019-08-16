const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaError = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')

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

app.use(bodyParser());
routing(app)

app.listen(5000, () => console.log('listen at 5000'));