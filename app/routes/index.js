const Router = require("koa-router");
const router = new Router();

// 课程相关
const courseRouter = require("./api/course_router");
router.use(courseRouter.routes());

// 例子相关
const exampleRouter = require("./api/example_router");
router.use(exampleRouter.routes());

// 学校相关
const schoolRouter = require("./api/school_router");
router.use(schoolRouter.routes());

// 用户相关
const userRouter = require("./api/user_router");
router.use(userRouter.routes());

module.exports = router;
