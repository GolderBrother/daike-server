/*
 * @Author: james.zhang 
 * @Date: 2018-09-07 21:30:37 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-07 21:32:04
 * @Description: example collection 
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const exampleSchema = new Schema({
  msg: {
    type: String,
    required: true
  },
}, { collection: 'example', versionKey: false});

module.exports = mongoose.model('example', exampleSchema);