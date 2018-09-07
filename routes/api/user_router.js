/*
 * @Author: james 
 * @Email: 1204788939@qq.com
 * @Date: 2018-08-14 16:04:18 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-07 21:08:24
 * @Description: user router
 */

const Router = require('koa-router');
const router = new Router();
const user_controller = require('./../../app/controllers/user_controller');

router.get('/get', user_controller.get);
router.get('/insertAllUsers',user_controller.insertAllUsers);
router.get('/insertAllPassword',user_controller.insertAllPassword);
router.post('/post', user_controller.post);
router.post('/login', user_controller.login);
router.post('/register', user_controller.register);
router.post('/update/user', user_controller.updateUserInfo);

module.exports = router;