const {DataTypes} = require('sequelize')

const seq = require('../db/seq')

// 创建数据模型user
// 'zd_user是对应zd_users'
const User = seq.define('zd_user',
{
//   id主键会被sequelize自动创建
  user_name:{
    type:DataTypes.STRING,
    allowNull:false,
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


module.exports = User