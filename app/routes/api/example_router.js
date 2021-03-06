/*
 * @Author: james 
 * @Email: 1204788939@qq.com
 * @Date: 2018-08-25 10:58:51 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-10-15 13:59:43
 * @Description: example router 
 */

const Router = require('koa-router');
const router = new Router();
const example_controller = require('../../controllers/example_controller');

router.get('/insertAllExamples',example_controller.insertAllExamples);
router.get('/example/get', example_controller.getExample);
router.post('/example/post', example_controller.postExample);

module.exports = router;