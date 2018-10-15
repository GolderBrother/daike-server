/*
 * @Author: james 
 * @Email: 1204788939@qq.com
 * @Date: 2018-08-17 17:03:09 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-10-15 21:10:12
 * @Description: course api 
 */

const Course_col = require('./../models/course');
const formatJsonData = require('../utils/formatJsonData');
const fs = require("fs");

const courseService = require('../service/course_service');


// 插入所有的课程数据
const insertAllCourse = (ctx, next) => {
  console.log("formatJsonData:", formatJsonData)
  fs.readFile('./data_json/courses.json', 'utf8', (err, data) => {
    if (err) {
      console.error('read file error:' + err);
    } else {
      // data = JSON.parse(data);
      data = formatJsonData(JSON.parse(data), "province", "reward");
      console.log(data)
      let saveCount = 0;
      data.map(async (item, index) => {
        try {
          await Course_col.create(item);
          saveCount++;
          console.log("成功:", saveCount)
        } catch (error) {
          console.log("失败:", error)
        }
      })
    }
  })
  ctx.body = '开始导入数据';
}

// 获取所有课程
const getCourse = async (ctx, next) => {
  const req = ctx.request.body;
  const { status } = req;
  // const courses = await Course_col.find({
  //   status: req.status
  // }, {
  //   _id: 0
  // }).sort({
  //   _id: -1
  // }); //按照 _id 字段 倒序排列

  // if (courses) {
  //   ctx.status = 200;
  //   ctx.body = {
  //     code: 1,
  //     data: courses
  //   }
  // } else {
  //   ctx.status = 200;
  //   ctx.body = {
  //     code: 0,
  //     msg: '参数错误！'
  //   }
  // }
  const res = await courseService.getCourse(status);
  ctx.status = 200;
  ctx.body = res;
};
// 获取所有课程  分页
const getCourseByPage = async (ctx, next) => {
  const {
    status
  } = ctx.request.body;
  const pageNum = ctx.request.body.pageNum * 1,
    pageIndex = ctx.request.body.pageIndex * 1;
  // if (pageNum && pageIndex) {
  //   // 查询开始页数(skip)和查询条数(limit)
  //   const startIndex = (pageIndex - 1) * pageNum;
  //   const courses = await Course_col.find({
  //     status
  //   }, {
  //     _id: 0
  //   }).skip(startIndex).limit(pageNum).sort({
  //     _id: -1
  //   });
  //   ctx.status = 200;
  //   if (courses.length) {
  //     ctx.body = {
  //       code: 1,
  //       data: courses
  //     }
  //   } else {
  //     ctx.body = {
  //       code: 0,
  //       msg: "参数错误！"
  //     }
  //   }
  // } else {
  //   ctx.status = 200;
  //   ctx.body = {
  //     code: 0,
  //     msg: "参数错误！"
  //   }
  // }
  const res = await courseService.getCourseByPage(pageNum, pageIndex);
  console.log(res);
  ctx.status = 200;
  ctx.body = res;
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
  // 第二个条件为筛选字段,例如：{collections: 1,_id:0} 只需要collections字段，不需要 _id 的字段
  // sort 排序 按照字段 _id 倒序
  // let courses = [];
  // if (type == 'publish') {
  //   courses = await Course_col.find({
  //     publisher: userId
  //   }, {
  //     _id: 0
  //   }).sort({
  //     "_id": -1
  //   });
  // } else if (type == 'substitute') { // receiver
  //   courses = await Course_col.find({
  //     receiver: userId
  //   }, {
  //     _id: 0
  //   }).sort({
  //     "_id": -1
  //   });
  // } else {
  //   const result = await User_col.findOne({
  //     userId
  //   }, {
  //     collections: 1,
  //     _id: 0
  //   });

  //   const collections = result.collections;

  //   for (let collection of collections) {
  //     const course = await Course_col.findOne({
  //       id: collection
  //     }, {
  //       _id: 0
  //     });
  //     courses.push(course);
  //   }
  // }
  const res = await courseService.getCourseByType(type, userId);
  ctx.body = res;
}

// 更新我 发布（publish）的课程
const updateCourseByPublish = async (ctx,next) => {
  let req = ctx.request.body;
  const { id,publisher } = req;
  if(!req.publisher || !req.schoolId || !req.courseTime || !req.coursePlace){
    ctx.body = {
      code:0,
      msg:"缺少必要参数！"
    }
    return;
  };
  // const updateRes = await Course_col.update({id,publisher},{$set:req});
  // console.log(updateRes)
  // ctx.body = {
  //   code:1,
  //   data:updateRes
  // }
  
  const res = await courseService.updateCourseByPublish(id,publisher,req);
  let msg = "";
  msg = res.data.nModified === 1 ? "success" : "failed";
  ctx.body = {
    ...res,
    msg
  };
  // const courses = await Course_col.findOne({id:courseId,publisher:userId});
  // console.log(courses)
  // 有课程就更新，没有就新增
  // if(courses.length > 0){
  //   const updateRes = await Course_col.update({id:courseId,publisher:userId},{$set:req});
  //   console.log(updateRes)
  //   ctx.body = {
  //     code:1,
  //     data:updateRes
  //   }
  // }else{
  //   const uuid = uuidv1();
  //   req.id = uuid;
  //   const createRes = await Course_col.create(req);
  //   console.log(createRes)
  //   ctx.body = {
  //     code:1,
  //     data:updateRes
  //   }
  // }

}

// 删除我 发布（publish）的课程 
// 取消我 代课（substitute）| 收藏（collect）的课程
const deleteCourseByType = async (ctx, next) => {
  const {
    userId,
    type,
    course
  } = ctx.request.body;
  ctx.status = 200;
  if (!userId || !type) {
    ctx.body = {
      code: 0,
      msg: "缺少必要参数！"
    }
    return;
  };
  const {
    id: coursId
  } = course;
  // let result = {};
  // const {
  //   id: coursId
  // } = course
  // if (type == "publish") {
  //   result = await Course_col.deleteOne({
  //     id: coursId
  //   });
  // } else if (type == "substitute") {
  //   // 取消我 代课(substitute) 的课程
  //   result = await Course_col.update({
  //     receiver: userId,
  //     id: coursId
  //   }, {
  //     $set: {
  //       status: 'open',
  //       closeTime: "",
  //       receiver: "",
  //       receiverName: "",
  //     }
  //   });
  // } else {
  //   // 取消我 收藏（collect）的课程
  //   result = await User_col.update({
  //     userId
  //   }, {
  //     $pull: {
  //       "collections": coursId
  //     }
  //   })
  // }
  // ctx.body = {
  //   code: 1,
  //   msg: result
  // }
  const res = await courseService.deleteCourseByType(type, coursId, userId);
  console.log("deleteCourseByType", res);
  ctx.body = res;
}


// 发布课程
const publishCourse = async (ctx, next) => {
  let req = ctx.request.body;
  ctx.status = 200;

  // if (!req.publisher || !req.schoolId || !req.courseTime || !req.coursePlace) {
  //   ctx.body = {
  //     code: 0,
  //     msg: '缺少必要参数！'
  //   }
  //   return;
  // }

  // req.id = uuid;
  // const result = await Course_col.create(req);

  // if (result) {
  //   ctx.body = {
  //     code: 1,
  //     msg: '发布成功！'
  //   }
  // } else {
  //   ctx.body = {
  //     code: 0,
  //     msg: '发布失败！'
  //   }
  // }
  const res = await courseService.publishCourse(req, uuid);
  console.log("publishCourse", res);
  ctx.body = res;
}

// 代课
const substituteCourse = async (ctx, body) => {
  const req = ctx.request.body;
  const { userId, userName, course } = req;
  ctx.status = 200;
  // if (!req.userId || !req.userName) {
  //   ctx.body = {
  //     code: 0,
  //     msg: '缺少必要参数'
  //   }
  //   return;
  // }

  // const course = req.course;
  // if (req.userId == course.publisher) {
  //   ctx.body = {
  //     code: 0,
  //     msg: '发布者和代课者是同一人'
  //   }
  //   return;
  // }

  // const receiver = await Course_col.findOne({
  //   id: course.id
  // }, {
  //   receiver: 1
  // });

  // if (receiver.receiver) {
  //   ctx.body = {
  //     code: 0,
  //     msg: '很遗憾，被人捷足先登了！'
  //   }
  //   return;
  // }

  // const result = await Course_col.update({
  //   id: course.id
  // }, {
  //   $set: {
  //     status: 'received',
  //     closeTime: formatDate(new Date()),
  //     receiver: req.userId,
  //     receiverName: req.userName,
  //   }
  // });

  // if (result.nModified) {
  //   ctx.body = {
  //     code: 1,
  //     msg: '代课成功！'
  //   }
  // } else {
  //   ctx.body = {
  //     code: 0,
  //     msg: '代课失败！'
  //   }
  // }
  const res = await courseService.substituteCourse(userId, userName, course);
  console.log("substituteCourse", res);
  ctx.body = res;
}

// 收藏
const collectCourse = async (ctx, next) => {
  const req = ctx.request.body;
  const userId = req.userId;
  const courseId = req.courseId;

  // if (!userId || !courseId) {
  //   ctx.status = 200;
  //   ctx.body = {
  //     code: 0,
  //     msg: '收藏成功！'
  //   }
  //   return;
  // }

  // const result = await User_col.findOne({
  //   userId
  // }, {
  //   collections: 1,
  //   _id: 0
  // });

  // const collections = result.collections;

  // ctx.status = 200;
  // if (collections.includes(courseId)) {
  //   ctx.body = {
  //     code: 1,
  //     msg: '已收藏该课程！'
  //   }
  //   return;
  // }

  // collections.push(courseId);

  // await User_col.update({
  //   userId: req.userId
  // }, {
  //   $set: {
  //     collections,
  //   }
  // });

  // ctx.body = {
  //   code: 1,
  //   msg: '收藏成功！'
  // }
  const res = await courseService.collectCourse(userId, courseId);
  console.log("collectCourse", res);
  ctx.status = res["status"];
  ctx.body = res["data"];
}

module.exports = {
  getCourse,
  getCourseByType,
  getCourseByPage,
  deleteCourseByType,
  insertAllCourse,
  publishCourse,
  substituteCourse,
  collectCourse,
  updateCourseByPublish
}