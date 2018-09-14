/*
 * @Author: james 
 * @Date: 2018-08-14 16:02:09 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-14 14:53:30
 * @Description: config file 
 */

module.exports = {
  port: 3000, // 项目启动的端口
  db: 'mongodb://localhost:27017/daiKe', // 数据库地址
  saltTimes: 3 // 加盐的次数（用户密码加密）
}