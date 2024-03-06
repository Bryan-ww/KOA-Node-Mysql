
const {APP_PORT} = require('./config/config.default')

const app =require('./app')
// 
// app.use(use(router.allowedMethods());)
// 最基本的用法
// app.use(async (ctx,next) =>{
//   ctx.body = 'hello world'
// })

app.listen(APP_PORT,()=>{
    console.log(`server is running on http://localhost:${APP_PORT}`)
})