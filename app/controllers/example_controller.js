/*
 * @Author: james 
 * @Email: 1204788939@qq.com
 * @Date: 2018-08-25 10:43:58 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-07 21:04:16
 * @Description: example api 
 */

const Example_col = require('./../models/example');
const fs = require('fs');

// 插入所有的例子数据
const insertAllExamples = (ctx,next) => {
  fs.readFile('./data_json/example.json', (err,data) => {
    if(err){
      console.log('read file error:'+error)
    }else{
      let createCount = 0;
      data = JSON.parse(data)
      data.map(async (item,index) => {
        try {
          await Example_col.create(item);
          createCount++;
          console.log('成功:',createCount);
        } catch (error) {
          console.log('失败:',error)
        }
      }) 
    }
  })
  ctx.body = "开始导入数据"
}

const getExample = async (ctx, next) => {
  const req = ctx.request.query;

  const examples = await Example_col.find({}, { _id: 0 });

  ctx.status = 200;
  ctx.body = {
    msg: 'get request!!',
    data: {
      data: req,
      examples,
    }
  }
}

const postExample = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;
  if (!req.msg || typeof req.msg != 'string') {
    ctx.status = 401;
    ctx.body = {
      msg: 'post request!!',
      desc: `parameter error！！msg: ${req.msg}`,
      data: req
    }
    return;
  }

  const result = await Example_col.create({msg: req.msg});

  ctx.body = {
    msg: 'post request!!',
    desc: 'insert success!',
    data: result
  }
}

module.exports = {
  getExample,
  postExample,
  insertAllExamples
}