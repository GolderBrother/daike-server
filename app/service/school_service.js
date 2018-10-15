const School_col = require('./../models/school');

// 学校搜索
const searchSchoolByName = async (schoolName) => {
    let res = {};
    // limit 分页
    const schools = await School_col.find({
        name: new RegExp(schoolName)
    }, {
        _id: 0
    }).limit(10);

    res["status"] = 200;
    if (schools) {
        res["data"] = {
            code: 1,
            data: schools
        }
    } else {
        res["data"] = {
            code: 0,
            msg: 'err'
        }
    }
    return res;
}

module.exports = {
    searchSchoolByName
}