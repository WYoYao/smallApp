let valite=require("valite");

/**
 * Object 类型转换 Map
 */
const object2map=function(obj){
    let map=new Map();
    if(valite.get_type(obj)!="Object"){
        return map;
    }else{
        for (var key of Object.keys(obj)) {
            map.set(key,obj[key]);
        }
        return map;
    }
}

/**
 * 将Object 类型转换成为 Get 传值需要的字符串
 */
const obj2getstr=function(obj){
    if(Object.prototype.toString.call(obj)!="[object Object]"){
        console.error("arguments must be an object");
        return "";
    }else{
        let map = object2map(obj),result=[];
        return Array.from(map).map(item=>item.join("=")).join("&"); 
    }
}


module.exports={
    object2map,
    obj2getstr,
}