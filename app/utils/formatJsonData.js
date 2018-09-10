/*
 * @Author: james.zhang 
 * @Date: 2018-09-07 21:28:56 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-10 08:59:38
 * @Description: format 
 */

// 获取数字
const getNum = (arg) => {
    if((arg+'').indexOf('NumberInt') !== -1){
        return arg = arg.replace(/NumberInt\(/,'').replace(/\)/,'');
    }
}

// NumberInt(32) 类型数据 => 32
const formatJson = (arr,...keys) => {
    arr.forEach((json,index) => {
        for(let key of keys){
            if(key === "provinceId"){
                json[key] = getNum(json[key]) || json[key];
            }
            if(key === "province"){
                json[key] = getNum(json[key]) || json[key];
            }
            if( key === "reward" ){
                json[key] = getNum(json[key]) || json[key];
            }
        } 
    })
    return arr;
}

module.exports = formatJson