 /*
 * @Author: james 
 * @Email: 1204788939@qq.com
 * @Date: 2018-08-17 17:03:09 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-11 19:44:14
 * @Description: course router 
 */

const Router = require('koa-router');
const router = new Router();
const course_controller = require('./../../app/controllers/course_controller');

router.get('/insertAllCourse',course_controller.insertAllCourse);
router.post('/course', course_controller.getCourse);
router.post('/publish', course_controller.publishCourse);
router.post('/substitute', course_controller.substituteCourse);
router.post('/collect', course_controller.collectCourse);
router.post('/course/type', course_controller.getCourseByType);
router.post('/course/page', course_controller.getCourseByPage);
router.post('/course/del',course_controller.deleteCourseByType)

module.exports = router;