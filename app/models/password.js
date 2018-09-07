/*
 * @Author: james.zhang 
 * @Date: 2018-09-07 21:32:11 
 * @Last Modified by:  james.zhang 
 * @Last Modified time: 2018-09-07 21:32:11 
 * @Description: password collection 
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PasswordSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  hash: {
    type: String,
    required: true
  }
}, { collection: 'password', versionKey: false});

module.exports = mongoose.model('password', PasswordSchema);
