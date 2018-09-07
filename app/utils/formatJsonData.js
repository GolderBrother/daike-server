/*
 * @Author: james.zhang 
 * @Date: 2018-09-07 21:28:56 
 * @Last Modified by: james.zhang
 * @Last Modified time: 2018-09-07 21:29:43
 * @Description: format 
 */

// 获取数字
const getNum = (arg) => {
    return arg.replace(/NumberInt\(/,'').replace(/\)/,'')
}

// NumberInt(32) 类型数据 => 32
const formatJson = (arr,...keys) => {
    arr.forEach((json,index) => {
        for(let key of keys){
            if(key === "provinceId"){
                if((json[key]+'').indexOf('NumberInt') !== -1){
                    json[key] = getNum(json[key]);
                }
            }
            if(key === "province"){
                if((json[key]+'').indexOf('NumberInt') !== -1){
                    json[key] = getNum(json[key]);
                }
            }
            if( key === "reward" ){
                if((json[key]+'').indexOf('NumberInt') !== -1){
                    json[key] = getNum(json[key]);
                }
            }
        } 
    })
    return arr;
}

module.exports = formatJson