/*
 * @Author: james 
 * @Email: 1204788939@qq..com 
 * @Date: 2018-08-20 14:55:28 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-10-15 17:17:21
 * @Description: school api 
 */

// const School_col = require('./../models/school');
const schoolService = require('../service/school_service');
const formatJsonData = require('../utils/formatJsonData');
const fs = require('fs');

// 插入所有的学校数据
const insertAllSchool = (ctx,next) => {
  fs.readFile('../../data_json/universities.json',(err,data) => {
    if(err){
      console.log('read file error:',err)
    }else{
      let createCount = 0;
      data = formatJsonData(JSON.parse(data),"provinceId");
      data.forEach(async (item,index) => {
        try {
          await School_col.create(item);
          createCount++;
          console.log('成功:',createCount)
        } catch (error) {
          console.log('失败:',error)
        }
      })
    }
  })
  ctx.body = "开始导入数据"
}


// 学校搜索
const searchSchoolByName = async (ctx, next) => {
  const req = ctx.request.body;
  const { schoolName } = req;
  // limit 分页
  // const schools = await School_col.find({
  //   name: new RegExp(req.schoolName)
  // }, { _id: 0 }).limit(10);

  // ctx.status = 200;
  // if (schools) {
  //   ctx.body = {
  //     code: 1,
  //     data: schools
  //   }
  // } else {
  //   ctx.body = {
  //     code: 0,
  //     msg: 'err'
  //   }
  // }
  const res = await schoolService.searchSchoolByName(schoolName);
  ctx.status = res["status"];
  ctx.body = res["data"];
}

module.exports = {
  searchSchoolByName,
  insertAllSchool
}