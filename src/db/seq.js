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

module.exports = seq