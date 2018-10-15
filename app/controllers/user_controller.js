/*
 * @Author: james 
 * @Email: 1204788939@qq.com 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-10-15 21:09:25
 * @Description: user api 
 */

// 获取User模型(model)
const User_col = require('./../models/user');
const Passport_col = require('./../models/password')
const uuidv1 = require('uuid/v1');
const fs = require('fs');

const userService = require("../service/user_service");

// test get
const get = async (ctx, next) => {
  ctx.status = 200;
  ctx.body = {
    msg: 'get request!!',
    data: {
      data: ctx.request.query
    }
  }
}

// 批量插入用户名等数据
const insertAllUsers = (ctx, next) => {
  fs.readFile('./data_json/user.json', 'utf8', (err, data) => {
    if (err) {
      console.error('read file error:' + err)
    } else {
      data = JSON.parse(data)
      // 获取User模型(model)
      let saveCount = 0;
      data.map(async (value, index) => {
        try {
          await User_col.create(value);
          saveCount++;
          console.log('成功:', saveCount);
        } catch (error) {
          saveCount--;
          console.log('失败:', error.message)
        }
      })
    }
  })
  ctx.body = "开始导入数据"
}

// 批量插入密码数据
const insertAllPassword = (ctx, next) => {
  fs.readFile('./data_json/password.json', 'utf8', (err, data) => {
    if (err) {
      console.log('read file error:', err)
    } else {
      let createCount = 0;
      data = JSON.parse(data);
      data.map(async (item, index) => {
        try {
          await Passport_col.create(item);
          createCount++;
          console.log('成功:', createCount);
        } catch (error) {
          console.log('失败:', error);
        }
      })
    }
  })
  ctx.body = "开始导入数据"
}

// test post
const post = async (ctx, next) => {
  ctx.status = 200;
  ctx.body = {
    msg: 'post request!!',
    data: {
      data: ctx.request.body
    }
  }
}

// 登录
const login = async (ctx, next) => {
  const req = ctx.request.body;
  const { account, password } = req;
  const res = await userService.login(account, password);
  console.log("login", res);
  ctx.status = res.status;
  ctx.body = res.data;
  // 获取用户的 userId
  // const user = await User_col.findOne({
  //   account: req.account
  // }, {
  //   __v: 0,
  //   _id: 0
  // });
  // if (!user) {
  //   ctx.status = 200;
  //   ctx.body = {
  //     code: 0,
  //     msg: 'account or password error!'
  //   }
  //   return;
  // }

  // const userId = user.userId;

  // // 获取数据库中的 hash
  // const pass = await Passport_col.findOne({
  //   userId
  // }, {
  //   hash: 1,
  // });

  // const match = await passport.validate(req.password, pass.hash);
  // ctx.status = 200;
  // if (match) {
  //   ctx.body = {
  //     code: 1,
  //     msg: 'login success',
  //     data: user
  //   }
  //   return;
  // }

  // ctx.body = {
  //   code: 0,
  //   msg: 'account or password error!'
  // }
}

// 注册
const register = async (ctx, next) => {
  const req = ctx.request.body;
  const { account } = req;
  const res = await userService.register(account);
  console.log("register", res);
  ctx.status = res["status"];
  ctx.body = res["data"];
  // 获取用户的 userId
  // const user = await User_col.findOne({
  //   account: req.account
  // });

  // ctx.status = 200;
  // if (user) {
  //   ctx.body = {
  //     code: 0,
  //     msg: '用户名重复！'
  //   }
  //   return;
  // }

  // // 插入新用户
  // const userId = uuidv1();
  // const newUser = await User_col.create({
  //   userId,
  //   account: req.account
  // });

  // if (newUser) {
  //   // 加密
  //   const hash = await passport.encrypt(req.password, config.saltTimes);
  //   const {
  //     userId,
  //     account
  //   } = newUser;
  //   const result = await Passport_col.create({
  //     userId,
  //     hash
  //   })

  //   if (result) {
  //     ctx.body = {
  //       code: 1,
  //       msg: '注册成功！',
  //       data: {
  //         userId,
  //         account
  //       }
  //     };
  //   }
  // } else {
  //   ctx.body = {
  //     code: 0,
  //     msg: '注册失败！'
  //   };
  // }
}

// 更改密码
const changePassword = async (ctx, next) => {
  const {
    account,
    password
  } = ctx.request.body;
  const res = await userService.changePassword(account, password);
  console.log("changePassword", res);
  ctx.status = res["status"];
  ctx.body = res["data"];
  // const user = await User_col.findOne({
  //   account
  // });
  // ctx.status = 200;
  // if (!user || user === null) {
  //   ctx.body = {
  //     code: 0,
  //     msg: "用户名不存在"
  //   }
  //   return
  // }
  // const {
  //   userId
  // } = user;
  // // 密码:加盐加密
  // const newHash = await passport.encrypt(password, config.saltTimes)
  // const res = await Passport_col.updateOne({
  //   userId
  // }, {
  //   $set: {
  //     hash: newHash
  //   }
  // })
  // if (res.ok) {
  //   ctx.body = {
  //     code: 1,
  //     msg: 'change password successed',
  //     data: {
  //       account
  //     }
  //   }
  // }
}

// 更新个人信息
const updateUserInfo = async (ctx, next) => {
  const req = ctx.request.body;
  const res = await userService.updateUserInfo(req);
  console.log("updateUserInfo", res);
  ctx.status = res["status"];
  ctx.body = res["data"];
  // 获取用户的 userId
  // const result = await User_col.updateOne({
  //   userId: req.userId
  // }, req);

  // ctx.status = 200;
  // console.log(result)
  // // 判断数据是否有改变，没改变就保存失败
  // if (result.nModified == 1) {
  //   ctx.body = {
  //     code: 1,
  //     msg: 'save successed!'
  //   }
  // } else {
  //   ctx.body = {
  //     code: 0,
  //     msg: 'save failed!'
  //   }
  // }
}

module.exports = {
  get,
  post,
  login,
  register,
  changePassword,
  updateUserInfo,
  insertAllUsers,
  insertAllPassword
}