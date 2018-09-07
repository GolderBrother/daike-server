/*
 * @Author: james 
 * @Email: 1204788939@qq.com
 * @Date: 2018-08-20 15:03:39 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-07 21:07:53
 * @Description: school router 
 */

const Router = require('koa-router');
const router = new Router();
const school_controller = require('./../../app/controllers/school_controller');

router.get('/insertAllSchool',school_controller.insertAllSchool);
router.post('/school', school_controller.searchSchoolByName);

module.exports = router;