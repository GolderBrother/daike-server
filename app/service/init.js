/*
 * @Author: james.zhang 
 * @Date: 2018-09-07 21:26:07 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-14 15:53:39
 * @Description: /api 
 */

const mongoose = require('mongoose');
const glob = require("glob");
const path = require('path');
const config = require('../config');

const connectMongoDb = ()　=> {
    let maxConnectTimes = 0;
    const { db }= config;
    // 连接数据库
    // 当前的URL字符串解析器被弃用,mongoose的 useNewUrlParser 警告解决办法
    mongoose.connect(db,{useNewUrlParser:true})
    return new Promise ((resolve,reject) => {
        // 增加数据库监听事件
        // 数据库断开
        mongoose.connection.on("disconnect",() => {
            console.log('***********数据库断开***********')
            if(maxConnectTimes < 3){
                maxConnectTimes++;
                mongoose.connect(db);
            }else{
                reject()
                throw new Error("Failed to connect to database")
            }
        })
        // 数据库错误
        mongoose.connection.on("error",() => {
            if(maxConnectTimes < 3){
                maxConnectTimes++;
                mongoose.connect(db);
            }else{
                reject();
                throw new Error("database error")
            }
        })
        // 数据库连接成功
        mongoose.connection.once("open",() => {
            console.log('Connecting MongoDB Successfully');
            resolve();
        })
    })
}

/**
 * description:glob：node的glob模块允许你使用 * 等符号，来写一个glob规则，像在shell里一样，获取匹配对应规则文件。
 * resolve: 将一系列路径或路径段解析为绝对路径。
 */

// glob.sync同步引入所有的schema文件，然后用forEach的回调方法require（引入）进来
const initSchemas = () => {
    glob.sync(path.resolve(__dirname,'../models/*.js')).forEach(require)
}

module.exports = {
    connectMongoDb,
    initSchemas
}