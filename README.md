## 启动
```
npm install or cnpm install or yarn install 

node app.js
```

## 源码目录介绍
```
├── app                        // 主项目目录
│   ├── controllrts            // 控制器目录
│   │   └── ...                // 各个表对应的控制器
│   ├── middleware             // 中间件目录
│   │   └── resFormat.js       // 格式化返回值（我目前没用） 
│   ├── models                 // 表目录
│   │   ├── course.js          // 课程表
│   │   ├── example.js         // 举例用的表（请忽略）
│   │   ├── password.js        // 密码表
│   │   ├── school.js          // 学校表
│   │   └── user.js            // 用户表
│   └── utils                  // 工具库
│   │   ├── formatDate.js      // 时间格式化
│   │   └── formatJsonData.js  // 导入数据库的 json 数据处理                                       
│   │   └── passport.js        // 用户密码加密和验证工具
│   └── service                // 服务层
│   │   └── init.js            // 初始化链接mondodb
├── data_json                  // 导入数据库的 json 文件(用来快速创建数据)
├── routes                     // 路由目录
│   └── api                    // 接口目录
│   │   ├── course_router.js   // 课程相关接口
│   │   ├── example_router.js  // 举例用的接口
│   │   ├── school_router.js   // 学校相关接口
│   │   └── user_router.js     // 用户相关接口
├── app.js                     // 项目入口
└── config.js                  // 基础配置信息
```