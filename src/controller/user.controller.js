const {createUser,getUserInfo} = require('../service/user.service')
const {userRegisterFail } = require('../constant/errorType')
class UserController {
    async register(ctx,next){
        // 1.获取请求body的数据
        // console.log(ctx.request.body);
        const {user_name,password} = ctx.request.body
        // 1.1对请求的数据校验以及错误处理
        // if(!user_name || !password){
        //     console.log('用户名或密码为空',ctx.request.body); //这里打印错误是为了在错误日志里可以查到
        //     ctx.status = 400
        //     ctx.body ={
        //         code: 10001,
        //         message:'用户名或者密码为空',
        //         result:'',
        //     }
        //     return
        // }
        // if(getUserInfo({user_name})){
        //     ctx.status = 409 //冲突，已存在该数据
        //     ctx.body = {
        //         code:10002,
        //         message:'用户已存在',
        //         result:'',
        //     }
        //     return
        // }

        // 2.操作数据库，插入数据
        try {
            const res = await createUser(user_name,password)
            // console.log(res);
            // 3.返回结果
            ctx.body = {
                code:0,
                message:'用户注册成功',
                result:{
                    id:res.id,
                    user_name:res.user_name,
                }
            }
        } catch (error) {
            console.log(error);
            // 触发一个报错
            ctx.app.emit('error',userRegisterFail,ctx)
        }
       
    }
    async login(ctx,next){
        ctx.body = '登录成功'
    }
}

module.exports = new UserController()