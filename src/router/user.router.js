const Router = require('@koa/router')
const {register,login} = require('../controller/user.controller')
const router  = new Router({prefix:'/users'})
// 引入中间件验证器
const {userValidator,verifyUser} = require('../middleware/user.middleware')
// GET /users/ 注册接口
router.post('/register',userValidator,verifyUser,register)
router.post('/login',login)

module.exports = router