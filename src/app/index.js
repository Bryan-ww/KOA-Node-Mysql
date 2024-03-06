const Koa = require('koa')
const app = new Koa()
const {koaBody} = require('koa-body')
// 引入路由
const Router = require('@koa/router')
const userRouter = require('../router/user.router')
const errhandler = require('../app/errhandler')
// 注册中间件，app.use里的参数是一个函数
// 使用koabody会把所有数据放入一个对象中，并放入ctx.body中
app.use(koaBody())
app.use(userRouter.routes())
app.on('error',errhandler)
module.exports = app