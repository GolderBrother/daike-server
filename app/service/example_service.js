const Example_col = require('./../models/example');

const getExample = async (req) => {
    let res = {};
    const examples = await Example_col.find({}, {
        _id: 0
    });
    res["status"] = 200;
    res["data"] = {
        msg: 'success!',
        data: {
            data: req,
            examples,
        }
    };
    return res;
}

const postExample = async (req) => {
    let res = {};
    res["status"] = 200;
    if (!req.msg || typeof req.msg != 'string') {
        res["status"] = 401;
        res["data"] = {
            msg: `parameter error！！msg: ${req.msg}`,
            data: req
        }
        return;
    }

    const result = await Example_col.create({
        msg: req.msg
    });

    res["data"] = {
        msg: 'insert success!',
        data: result
    }
    return res;
}

module.exports = {
    getExample,
    postExample
}