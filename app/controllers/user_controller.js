/*
 * @Author: james 
 * @Email: 1204788939@qq.com 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-07 21:05:01
 * @Description: user api 
 */

const config = require('./../../config');
const passport = require('./../utils/passport');
const User_col = require('./../models/user');
const Passport_col = require('./../models/password')
const uuidv1 = require('uuid/v1');
const fs = require('fs');

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
const insertAllUsers = (ctx,next) => {
  fs.readFile('./data_json/user.json','utf8',(err,data) => {
    if(err){
      console.error('read file error:'+err)
    }else{
      data = JSON.parse(data)
      // 获取User模型(model)
      let saveCount = 0;
      // const User = mongoose.model('User')
      data.map(async (value,index) => {
        // 实例化模型，才能调用模型方法
        // const newUser = User_col(value);
        try {
          await User_col.create(value);
          saveCount++;
          console.log('成功:',saveCount);
        } catch (error) {
          saveCount--;
          console.log('失败:',error.message)
        }
      })
    }
  })
  ctx.body = "开始导入数据"
}

const insertAllPassword = (ctx,next) => {
  fs.readFile('./data_json/password.json','utf8',(err,data) => {
    if(err){
      console.log('read file error:',err)
    }else{
      let createCount = 0;
      data = JSON.parse(data);
      data.map(async (item,index) => {
        try {
          await Passport_col.create(item);
          createCount++;
          console.log('成功:',createCount);
        } catch (error) {
          console.log('失败:',error);
        }
      })
    }
  })
  ctx.body = "开始导入数据"
}

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

  // 获取用户的 userId
  const user = await User_col.findOne({
    account: req.account
  }, {
    __v: 0,
    _id: 0
  });
  if (!user) {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: 'account or password error!'
    }
    return;
  }

  const userId = user.userId;

  // 获取数据库中的 hash
  const pass = await Passport_col.findOne({
    userId
  }, {
    hash: 1,
  });

  const match = await passport.validate(req.password, pass.hash);
  ctx.status = 200;
  if (match) {
    ctx.body = {
      code: 1,
      msg: 'login success',
      data: user
    }
    return;
  }

  ctx.body = {
    code: 0,
    msg: 'account or password error!'
  }
}

// 注册
const register = async (ctx, next) => {
  const req = ctx.request.body;

  // 获取用户的 userId
  const user = await User_col.findOne({
    account: req.account
  });

  ctx.status = 200;
  if (user) {
    ctx.body = {
      code: 0,
      msg: '用户名重复！'
    }
    return;
  }
  
  // 插入新用户
  const userId = uuidv1();
  const newUser = await User_col.create({
    userId,
    account: req.account
  });

  if (newUser) {
    // 加密
    const hash = await passport.encrypt(req.password, config.saltTimes);
    const result = await Passport_col.create({
      userId: userId,
      hash
    })

    if (result) {
      ctx.body = {
        code: 1,
        msg: '注册成功！',
        data: {
          userId: newUser.userId,
          account: newUser.account
        }
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '注册失败！'
    };
  }
}

// 更新个人信息
const updateUserInfo = async (ctx, next) => {
  const req = ctx.request.body;

  // 获取用户的 userId
  const result = await User_col.updateOne({
    userId: req.userId
  }, req);

  ctx.status = 200;
  if (result.nModified == 1) {
    ctx.body = {
      code: 1,
      msg: 'save successed!'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: 'save failed!'
    }
  }
}

module.exports = {
  get,
  post,
  login,
  register,
  updateUserInfo,
  insertAllUsers,
  insertAllPassword
}