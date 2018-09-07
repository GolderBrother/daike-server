/*
 * @Author: james 
 * @Date: 2018-08-14 16:02:33 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-07 21:27:10
 * @Description: entry file
 */

const Koa = require('koa');
const config = require('./config');

// https://www.npmjs.com/package/koa2-cors
const cors = require('koa2-cors');

// https://www.npmjs.com/package/koa-bodyparser
const bodyParser = require('koa-bodyparser');

// https://github.com/Automattic/mongoose
// const mongoose = require('mongoose');

const { connectMongoDb,initSchemas } = require('./app/service/init')

const app = new Koa();

connectMongoDb();

initSchemas();

/* 
mongoose.connect(config.db, {useNewUrlParser:true}, (err) => {
    if (err) {
        console.error('Failed to connect to database');
    } else {
        console.log('Connecting database successfully');
    }
});
*/

app.use(cors());
app.use(bodyParser());

const user_router = require('./routes/api/user_router');
const course_router = require('./routes/api/course_router');
const school_router = require('./routes/api/school_router');
const example_router = require('./routes/api/example_router');

app.use(user_router.routes()).use(user_router.allowedMethods());
app.use(course_router.routes()).use(course_router.allowedMethods());
app.use(school_router.routes()).use(school_router.allowedMethods());
app.use(example_router.routes()).use(example_router.allowedMethods());

app.listen(config.port,() => {
    console.log(`This server is listening on port ${config.port}`)
});