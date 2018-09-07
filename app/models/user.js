/*
 * @Author: james.zhang 
 * @Date: 2018-09-07 21:32:42 
 * @Last Modified by:  james.zhang 
 * @Last Modified time: 2018-09-07 21:32:42 
 * @Description: user collection
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    require: true
  },
  account: {
    type: String
  },
  userName: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  headerImg: {
    type: String
  },
  studentId: {
    type: String
  },
  school: {
    type: String
  },
  schoolId: {
    type: String
  },
  provinceId: {
    type: Number
  },
  major: {
    type: String
  },
  college: {
    type: String
  },
  wechat: {
    type: String
  },
  qq: {
    type: String
  },
  collections: {
    type: Array
  } 
}, { collection: 'user', versionKey: false});

module.exports = mongoose.model('user', UserSchema);
