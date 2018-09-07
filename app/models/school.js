/*
 * @Author: james.zhang 
 * @Date: 2018-09-07 21:32:31 
 * @Last Modified by:  james.zhang 
 * @Last Modified time: 2018-09-07 21:32:31 
 * @Description: school collection  
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SchoolSchema = new Schema({
  id: {
    type: String,
    unique: true,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  website: {
    type: String
  },
  provinceId: {
    type: String
  },
  level: {
    type: String
  },
  abbreviation: {
    type: String
  },
  city: {
    type: String
  },
}, { collection: 'universities', versionKey: false});

module.exports = mongoose.model('universities', SchoolSchema);

