/*
 * @Author: james.zhang 
 * @Date: 2018-10-15 18:14:08 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-10-15 21:03:40
 * @Description: /user_service 
 */
const config = require('./../config');
const passport = require('./../utils/passport');
// 获取User模型(model)
const User_col = require('./../models/user');
const Passport_col = require('./../models/password')
const uuidv1 = require('uuid/v1');

const login = async (account, password) => {
    let res = {};
    // 获取用户的 userId
    const user = await User_col.findOne({
        account: account
    }, {
        __v: 0,
        _id: 0
    });
    if (!user) {
        res["status"] = 200;
        res["data"] = {
            code: 0,
            msg: 'account or password error!'
        }

        return res;
    }

    const userId = user.userId;

    // 获取数据库中的 hash
    const pass = await Passport_col.findOne({
        userId
    }, {
        hash: 1,
    });

    const match = await passport.validate(password, pass.hash);
    res["status"] = 200;
    if (match) {
        res["data"] = {
            code: 1,
            msg: 'login success',
            data: user
        }
        return res;
    };
    res["data"] = {
        code: 0,
        msg: 'account or password error!'
    };
    return res;
}

const register = async (account) => {
    let res = {};
    // 获取用户的 userId
    const user = await User_col.findOne({
        account: account
    });
    res["status"] = 200;
    if (user) {
        res["data"] = {
            code: 0,
            msg: '用户名重复！'
        }
        return res;
    }

    // 插入新用户
    const userId = uuidv1();
    const newUser = await User_col.create({
        userId,
        account: account
    });

    if (newUser) {
        // 加密
        const hash = await passport.encrypt(req.password, config.saltTimes);
        const {
            userId,
            account
        } = newUser;
        const result = await Passport_col.create({
            userId,
            hash
        })

        if (result) {
            res["data"] = {
                code: 1,
                msg: '注册成功！',
                data: {
                    userId,
                    account
                }
            };
        }
    } else {
        res["data"] = {
            code: 0,
            msg: '注册失败！'
        };
    }
    return res;
}

const changePassword = async (account, password) => {
    let res = {};
    const user = await User_col.findOne({
        account
    });
    res["status"] = 200;
    if (!user || user === null) {
        res["data"] = {
            code: 0,
            msg: "用户名不存在"
        }
        return res;
    }
    const {
        userId
    } = user;
    // 密码:加盐加密
    const newHash = await passport.encrypt(password, config.saltTimes)
    const result = await Passport_col.updateOne({
        userId
    }, {
        $set: {
            hash: newHash
        }
    })
    if (result.ok) {
        res["data"] = {
            code: 1,
            msg: 'change password successed',
            data: {
                account
            }
        }
    }
    return res;
}

// 更新个人信息
const updateUserInfo = async (req) => {
    let res = {};
    // 获取用户的 userId
    const result = await User_col.updateOne({
      userId: req.userId
    }, req);
    res["status"] = 200;
    // 判断数据是否有改变，没改变就保存失败
    if (result.nModified == 1) {
      res["data"] = {
        code: 1,
        msg: 'save successed!'
      }
    } else {
      res["data"] = {
        code: 0,
        msg: 'save failed!'
      }
    }
    return res;
  }

module.exports = {
    login,
    register,
    changePassword,
    updateUserInfo
}