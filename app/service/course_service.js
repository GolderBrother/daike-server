const uuidv1 = require('uuid/v1');
const Course_col = require('./../models/course');
const User_col = require('./../models/user');
const formatDate = require('./../utils/formatDate');

const getCourse = async (status) => {
    const courses = await Course_col.find({
        status: status
    }, {
        _id: 0
    }).sort({
        _id: -1
    }); //按照 _id 字段 倒序排列
    let res = {};
    if (courses) {
        res = {
            code: 1,
            data: courses
        }
    } else {
        res = {
            code: 0,
            msg: '参数错误！'
        }
    }
    return res;
}

const getCourseByPage = async (pageNum, pageIndex) => {
    let res = {};
    if (pageNum && pageIndex) {
        // 查询开始页数(skip)和查询条数(limit)
        const startIndex = (pageIndex - 1) * pageNum;
        const courses = await Course_col.find({
            status
        }, {
            _id: 0
        }).skip(startIndex).limit(pageNum).sort({
            _id: -1
        });
        if (courses.length) {
            res = {
                code: 1,
                data: courses
            }
        } else {
            res = {
                code: 0,
                msg: "参数错误！"
            }
        }
    } else {
        res = {
            code: 0,
            msg: "参数错误！"
        }
    }
    return res;
}

const getCourseByType = async (type, userId) => {
    let courses = [];
    let res = {};
    if (type == 'publish') {
        courses = await Course_col.find({
            publisher: userId
        }, {
            _id: 0
        }).sort({
            "_id": -1
        });
    } else if (type == 'substitute') { // receiver
        courses = await Course_col.find({
            receiver: userId
        }, {
            _id: 0
        }).sort({
            "_id": -1
        });
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
    res = {
        code: 1,
        data: courses
    };
    return res;
}

const updateCourseByPublish = async (id, publisher, req) => {
    let res = {};
    const updateRes = await Course_col.update({
        id,
        publisher
    }, {
        $set: req
    });
    res = {
        code: 1,
        data: updateRes
    };
    return res;
}

const deleteCourseByType = async (type, coursId, userId) => {
    let res = {};
    let result = {};
    if (type == "publish") {
        result = await Course_col.deleteOne({
            id: coursId
        });
    } else if (type == "substitute") {
        // 取消我 代课(substitute) 的课程
        result = await Course_col.update({
            receiver: userId,
            id: coursId
        }, {
            $set: {
                status: 'open',
                closeTime: "",
                receiver: "",
                receiverName: "",
            }
        });
    } else {
        // 取消我 收藏（collect）的课程
        result = await User_col.update({
            userId
        }, {
            $pull: {
                "collections": coursId
            }
        })
    }
    res = {
        code: 1,
        msg: result
    };
    return res;
}

const publishCourse = async (req) => {
    let res = {};
    const uuid = uuidv1();
    if (!req.publisher || !req.schoolId || !req.courseTime || !req.coursePlace) {
        res = {
            code: 0,
            msg: '缺少必要参数！'
        }
        return res;
    }

    req.id = uuid;
    const result = await Course_col.create(req);

    if (result) {
        res = {
            code: 1,
            msg: '发布成功！'
        }
    } else {
        res = {
            code: 0,
            msg: '发布失败！'
        }
    }
    return res;
}

const substituteCourse = async (userId, userName, course) => {
    let res = {};
    if (!userId || !userName) {
        res = {
            code: 0,
            msg: '缺少必要参数'
        }
        return res;
    }

    if (userId == course.publisher) {
        res = {
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
        res = {
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
            receiver: userId,
            receiverName: userName,
        }
    });

    if (result.nModified) {
        res = {
            code: 1,
            msg: '代课成功！'
        }
    } else {
        res = {
            code: 0,
            msg: '代课失败！'
        }
    };
    return res;
}

const collectCourse = async (userId, courseId) => {
    let res = {};
    if (!userId || !courseId) {
        res["status"] = 200;
        // ctx.status = 200;
        res["data"] = {
            code: 0,
            msg: '收藏成功！'
        }
        return res;
    }

    const result = await User_col.findOne({
        userId
    }, {
        collections: 1,
        _id: 0
    });

    const collections = result.collections;

    if (collections.includes(courseId)) {
        res["status"] = 200;
        // ctx.status = 200;
        res["data"] = {
            code: 1,
            msg: '已收藏该课程！'
        }
        return res;
    }

    collections.push(courseId);

    await User_col.update({
        userId: userId
    }, {
        $set: {
            collections,
        }
    });
    res["status"] = 200;
    res = {
        code: 1,
        msg: '收藏成功！'
    }
    return res;
}

module.exports = {
    getCourse,
    getCourseByPage,
    getCourseByType,
    updateCourseByPublish,
    deleteCourseByType,
    publishCourse,
    substituteCourse,
    collectCourse
}