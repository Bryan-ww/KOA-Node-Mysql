## 一、项目的基本优化

安装dotenv ,读取根目录的.env文件，将配置写入process.env中

```
npm i dotenv
```

## 二、添加API路由

定义路由url

```
const Router = require('@koa/router')

const router  = new Router({prefix:'/users'})

// GET /users/

router.**get**('/',(ctx,**next**)=>{

  ctx.body = 'hello users'

})

module.exports = router
```

导入路由注册中间件

```
const userRouter = **require**('./router/user')

// 注册中间件，app.use里的参数是一个函数

app.use(userRouter.routes())
```

## 三、目录结构优化

1.单独建立app文件夹，把和koa相关的文件放在一起，主要是路由注册中间件

```
const Koa = require('koa')
const app = new Koa()
// 引入路由
const Router = require('@koa/router')
const userRouter = require('../router/user')
// 注册中间件，app.use里的参数是一个函数
app.use(userRouter.routes())
module.exports = app
```

2.设置接口控制器，同意管理接口操作

```
class UserController {
    async register(ctx,next){
        ctx.body = '用户注册成功'
    }
    async login(ctx,next){
        ctx.body = '登录成功'
    }
}

module.exports = new UserController()
```

3.导入控制器，放在不同意路由下

```
const Router = require('@koa/router')
const {register,login} = require('../controller/user.controller')
const router  = new Router({prefix:'/users'})

// GET /users/ 注册接口
router.get('/register',register)
// post登录接口
router.get('/login',login)

module.exports = router
```

## 四、解析Body

1.安装koa-body

```
npm install koa-body
```

2.改写app/index.js

```
const KoaBody = require('koa-body')
app.use(KoaBody())
```

## 五、解析请求的数据

改写user.controller.js

```

```

## 六、连接和操作数据库，封装响应结果

sequelize ORM数据库工具
ORM: 对象关系映射

- 数据表映射(对应)一个类
- 数据表中的数据行(记录)对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法

##### 1.安装Sequelize

```
npm install --save sequelize
```

##### 2.安装mysql2驱动

```
npm install --save mysql2
```

##### 3.连接数据库，创建db文件夹,创建一个seq实例对象并导出

```
const {Sequelize} = require('sequelize')
const {MYSQL_DB,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PWD} = require('../config/config.default')
const seq = new Sequelize(
    MYSQL_DB,MYSQL_USER,MYSQL_PWD,
    {
     host:MYSQL_HOST,
     dialect:'mysql'
    })
// authenticate()返回的是一个promise对象
seq.authenticate().then(()=>{
    console.log('数据库连接成功');
}).catch(err=>{
    console.log('数据库连接失败',err);
})

module.exports = seq 导出seq
```

##### 4.创建数据模型，创建model文件夹

```
const {DataTypes} = require('sequelize')

const seq = require('../db/seq')

// 创建数据模型user，调用sequelize.define（）方法
// 'zd_user是对应zd_users'
const User = seq.define('zd_user',
{
//   id主键会被sequelize自动创建
  user_name:{
    type:DataTypes.STRING,
    allNull:false,
    unique:true,
    comment:'用户名，唯一'
  },
  password:{
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment:'密码'
  },
  is_Admin:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment:'0:非管理员, 1,管理员,默认非管理员'
  }
})
// 参数force,是否强制删除已存在的表格
// User.sync() - 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
// User.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
// User.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
User.sync({force:true})


module.exports = User 导出模型
```

##### 5.在service层将数据插入数据库，导入模型对象，使用Model.create方法插入新数据

```
// service层主要封装数据库操作相关方法，关于数据库的操作可以放在这里面
// 引入数据模型
const User = require('../model/user.model')
class UserService{
    async createUser(user_name,password){
        // 插入数据,Model.create()返回是一个pormise对象
       let res = await User.create({ user_name,password})
       return res.dataValues
    }
}
module.exports = new UserService()
```

##### 6.处理数据库操作后返回的结果，在控制器中处理返回的结果

```
const {createUser} = require('../service/user.service')

class UserController {
    async register(ctx,next){
        // 1.获取请求body的数据
        // console.log(ctx.request.body);
        const {user_name,password} = ctx.request.body
        // 2.操作数据库，插入数据
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
    }
    async login(ctx,next){
        ctx.body = '登录成功'
    }
}

module.exports = new UserController()
```

## 七、错误处理

在控制器controller中进行数据库操作前的校验和处理错误

```
class UserController {
    async register(ctx,next){
        // 1.获取请求body的数据
        // console.log(ctx.request.body);
        const {user_name,password} = ctx.request.body
        // 1.1对请求的数据校验以及错误处理
        if(!user_name || !password){
            console.log('用户名或密码为空',ctx.request.body); //这里打印错误是为了在错误日志里可以查到
            ctx.status = 400
            ctx.body ={
                code: 10001,
                message:'用户名或者密码为空',
                result:'',
            }
            return
        }
        if(getUserInfo({user_name})){
            ctx.status = 409 //冲突，已存在该数据
            ctx.body = {
                code:10002,
                message:'用户已存在',
                result:'',
            }
            return
        }

        // 2.操作数据库，插入数据
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
    }

}
```

## 八、对于通用的方法可以注册成为中间件

![img](https://pic3.zhimg.com/v2-a9ae415552231968cb185960a9e9ec6e_r.jpg)

1.创建middleware文件夹（、middleware/user.middleware.js）

```
// 写一个验证器函数，抽取错误处理验证函数方法中间件

const userValidator = async (ctx,next)=>{
    const {user_name,password} = ctx.request.body
    if(!user_name || !password){
        console.log('用户名或密码为空',ctx.request.body); //这里打印错误是为了在错误日志里可以查到
        ctx.status = 400
        ctx.body ={
            code: 10001,
            message:'用户名或者密码为空',
            result:'',
        }
        return
    }
}
module.exports = {userValidator}
```

2.在路由命中前调用验证器中间件router层

```
const Router = require('@koa/router')
const {register,login} = require('../controller/user.controller')
const router  = new Router({prefix:'/users'})
// 引入中间件验证器
const {userValidator,verifyUser} = require('../middleware/user.middleware')
// GET /users/ 注册接口，注册中间件
router.post('/register',userValidator,verifyUser,register)
router.post('/login',login)

module.exports = router
```

3.抽取错误类型定义和错误处理层。创建constant文件夹，error.type.js

```
 、middleware/user.middleware.js
 ctx.app.emit(error,userExisted,ctx)触发error事件
```

建立errorhandler,在app文件中监听错误事件

```
**app/errhandler.js
// 建立并导出错误处理函数
module.exports= (err,ctx)=>{
   let status = 500 //默认
   switch (err.code){

    case '10001':
        status = 401;
        break;
    case "10002" :
        status = 409
        break;
    default:
        status = 500
   }
   ctx.status = status
   ctx.body = err
}
```



```
**app/index.js
const errhandler = require('../app/errhandler')
app.on('error',errhandler)

```

## 九、业务处理

1.密码加密
