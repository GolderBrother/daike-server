/*
 * @Author: james 
 * @Email: 1204788939@qq.com
 * @Date: 2018-08-17 17:03:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-07 20:44:07
 * @Description: course api 
 */

const uuidv1 = require('uuid/v1');
const Course_col = require('./../models/course');
const User_col = require('./../models/user');
const formatDate = require('./../utils/formatDate');
const formatJsonData = require('../utils/formatJsonData');
const fs = require("fs");


// 插入所有的课程数据
const insertAllCourse = (ctx,next) => {
  console.log("formatJsonData:",formatJsonData)
  fs.readFile('./data_json/courses.json','utf8',(err,data) => {
    if(err){
      console.error('read file error:'+err);
    }else{
      // data = JSON.parse(data);
      data = formatJsonData(JSON.parse(data),"province","reward");
      console.log(data)
      let saveCount = 0;
      data.map(async (item,index) => {
        try {
          await Course_col.create(item);
          saveCount++;
          console.log("成功:",saveCount)
        } catch (error) {
          console.log("失败:",error)
        }
      })
    }
  })
  ctx.body = '开始导入数据';
}

// 获取所有课程
const getCourse = async (ctx, next) => {
  const req = ctx.request.body;

  const courses = await Course_col.find({
    status: req.status
  }, { _id: 0 });

  if (courses) {
    ctx.status = 200;
    ctx.body = {
      code: 1,
      data: courses
    }
  } else {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: '参数错误！'
    }
  }
}

// 获取我 发布（publish） | 代课（substitute）| 收藏（collect） 的课程
const getCourseByType = async (ctx, next) => {
  const req = ctx.request.body;
  const userId = req.userId;
  const type = req.type;

  ctx.status = 200;
  if (!userId || !type) {
    ctx.body = {
      code: 0,
      msg: '缺少必要参数！'
    }
    return;
  }

  let courses = [];
  if (type == 'publish') {
    courses = await Course_col.find({
      publisher: userId
    }, { _id: 0 });
  } else if (type == 'substitute') {// receiver
    courses = await Course_col.find({
      receiver: userId
    }, { _id: 0 });
  } else {
    const result = await User_col.findOne({
      userId
    }, {
      collections: 1,
      _id: 0
    });
  
    const collections = result.collections;

    for (let collection of collections) {
      const course = await Course_col.findOne({
        id: collection
      }, {
        _id: 0
      });

      courses.push(course);
    }
  }

  ctx.body = {
    code: 1,
    data: courses
  }
}

// 发布课程
const publishCourse = async (ctx, next) => {
  const uuid = uuidv1();
  let req = ctx.request.body;
  ctx.status = 200;

  if (!req.publisher || !req.schoolId || !req.courseTime || !req.coursePlace) {
    ctx.body = {
      code: 0,
      msg: '缺少必要参数！'
    }
    return;
  }

  req.id = uuid;
  const result = await Course_col.create(req);

  if (result) {
    ctx.body = {
      code: 1,
      msg: '发布成功！'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '发布失败！'
    }
  }
}

// 代课
const substituteCourse = async (ctx, body) => {
  const req = ctx.request.body;

  ctx.status = 200;
  if (!req.userId || !req.userName) {
    ctx.body = {
      code: 0,
      msg: '缺少必要参数'
    }  
    return;
  }

  const course = req.course;
  if (req.userId == course.publisher) {
    ctx.body = {
      code: 0,
      msg: '发布者和代课者是同一人'
    }
    return;
  }

  const receiver = await Course_col.findOne({
    id: course.id
  }, {
    receiver: 1
  });

  if (receiver.receiver) {
    ctx.body = {
      code: 0,
      msg: '很遗憾，被人捷足先登了！'
    }
    return;
  }

  const result = await Course_col.update({
    id: course.id
  }, {
    $set: {
      status: 'received', 
      closeTime: formatDate(new Date()),
      receiver: req.userId,
      receiverName: req.userName,
    }
  });

  if (result.nModified) {
    ctx.body = {
      code: 1
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '代课失败！'
    }
  }
}

// 收藏
const collectCourse = async (ctx, next) => {
  const req = ctx.request.body;
  const userId = req.userId;
  const courseId = req.courseId;

  if (!userId || !courseId) {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: '收藏成功！'
    }
    return;
  }
  
  const result = await User_col.findOne({
    userId
  }, {
    collections: 1,
    _id: 0
  });

  const collections = result.collections;

  ctx.status = 200;
  if (collections.includes(courseId)) {
    ctx.body = {
      code: 1,
      msg: '已收藏该课程！'
    }
    return;
  } 

  collections.push(courseId);

  await User_col.update({
    userId: req.userId
  }, {
    $set: {
      collections,
    }
  });

  ctx.body = {
    code: 1,
    msg: '收藏成功！'
  }
}

module.exports = {
  getCourse,
  getCourseByType,
  insertAllCourse,
  publishCourse,
  substituteCourse,
  collectCourse
}