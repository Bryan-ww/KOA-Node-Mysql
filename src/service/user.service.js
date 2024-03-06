// 主要用来操作数据库
// 引入数据模型
const User = require('../model/user.model')
class UserService{
    async createUser(user_name,password){
        // 插入数据,Model.create()返回是一个pormise对象
       let res = await User.create({ user_name,password})
       return res.dataValues
    }
    async getUserInfo({id,user_name,password,is_admin}){
        const whereOpt = {}
        // 短路运算符，如果传了该值，则加入查询的where条件
        id && Object.assign(whereOpt, {id})
        user_name && Object.assign(whereOpt, {user_name})
        password && Object.assign(whereOpt, {password})
        is_admin && Object.assign(whereOpt, {is_admin})

        // 调用seq模型的findOne方法
        const res = await User.findOne({
            attributes:['id','user_name','password','is_admin'], //参数一：要查询的字段
            where:whereOpt //参数二：查询的条件
        })
        return res? res : null

    }
}
module.exports = new UserService()