// 中间件抽离
const { getUserInfo} = require('../service/user.service')
// 导入错误类型
const { userFormatError,userExisted,userRegisterFail} = require('../constant/errorType')
// 验证信息
const userValidator = async (ctx,next)=>{
    const {user_name,password} = ctx.request.body
    if(!user_name || !password){
        console.log('用户名或密码为空',ctx.request.body); //这里打印错误是为了在错误日志里可以查到
        ctx.app.emit('error',userFormatError,ctx)
        // ctx.status = 400
        // ctx.body ={
        //     code: 10001,
        //     message:'用户名或者密码为空',
        //     result:'',
        // }
        return
    }
    // 等待结果，然后放行
    await next()
}

// 验证用户
const verifyUser =  async (ctx,next)=>{
    const {user_name,password} = ctx.request.body
    // 优化getUserInfo({user_name})返回的是一个promise对象或者null,加上await
    try {
        const res = await getUserInfo({user_name})
        if(res){
            ctx.app.emit('error',userExisted,ctx)
            console.error('用户已存在',ctx.request.body);
            return  //需要返回不然会执行next()
        }
    } catch (err) {
        ctx.app.emit('error',userRegisterFail,ctx)
        console.error('用户注册失败',err)
        return 
    }

    
    await next()
}


module.exports = {userValidator,verifyUser}