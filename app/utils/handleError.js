// 添加统一的错误处理方法
const handleError = async (ctx,next) => {
    try {
        await next()
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            code:0,
            msg:error.message
        }
    }
}

module.exports = handleError;