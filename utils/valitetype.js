
/**
 * 传入需要验证的实例 返回其对应的类型
 */
const get_type=function(obj){
    return Object.prototype.toString.call(obj).slice(8,-1);
}

/**
 * 验证非空的字符串
 */
const isNullorUndefind=function(obj){
    if(obj==null || obj==void 0){
        return true;
    }else if(!obj.length){
        return true;
    }
    return false;
}

module.exports={
    get_type,
    isNullorUndefind
}