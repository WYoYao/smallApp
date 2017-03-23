
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

/**
 * 深度对比两个数据是否相同
 */
const valiteObject=function (targetValue, sourceValue) {
		var target,source;
		if(Object.keys(targetValue).length>Object.keys(sourceValue).length){
			target=targetValue;
			source=sourceValue;
		}else if(Object.keys(targetValue).length<Object.keys(sourceValue).length){
			target=sourceValue;
			source=targetValue;
		}else{
			target=targetValue;
			source=sourceValue;
		}

		//当有不是引用类型传入的时候
		if (!(target instanceof Object) || !(source instanceof Object)) {
			return target === source;
		}

		function Object2Object(obj) {
			return Object.keys(obj).reduce(function (content, key) {
				// 如果是引用类型递归
				if (obj[key] instanceof Object) {
					content[key] = Object2Object(obj[key]);
					// 值类型直接引用
				} else {
					content[key] = obj[key];
				}
				return content;
			}, {})
		}

		// 比较两个Objcet
		function equal(target, source) {
			// 循环遍历属性比较
			return Object.keys(target).reduce(function (content, key) {
				//如果一次不等于后面不再进行判断
				if (!content) return false;
				//都是引用类型的时候执行递归
				if (target[key] instanceof Object && source[key] instanceof Object) {
					return equal(target[key], source[key]);
				} else {
					return target[key] == source[key];
				}
			}, true);

		}

		return equal(Object2Object(target), Object2Object(source));
	}

module.exports={
    get_type,
    isNullorUndefind,
    valiteObject
}