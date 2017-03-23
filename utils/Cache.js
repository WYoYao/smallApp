
// 获取返回类
const Response=require("./Response.js");
let {get_type,isNullorUndefind}=require("./valitetype.js");


/**
 * 缓存类
 */

class Cache{
    constructor(){
        // 保存变量
        this.data=new Map();
    }
    /**
     * 写入Cache方法
     * DB       对应的分类
     * key      获取的键值
     * value    获取的值
     * res      返回值
     */
    setCache(DB,key,value){
        // 验证参数
        if(isNullorUndefind(DB))throw new TypeError("arguments error");
        // 获取对应的分类
        let DBit=this.data.get(DB) || new Map();
        // 写入信息
        DBit.set(key,value);
        //写入分类
        this.data.set(DB,DBit);
    }
    /**
     * 获取Cache方法
     * DB       对应的分类
     * key      获取的键值
     * res      返回值
     */
    getCache(DB,key){
        // 验证参数
        if(isNullorUndefind(DB))throw new TypeError("arguments error");
        // 获取对应的分类
        let DBit=this.data.get(DB) || new Map();

        
        
    }
}

let aa=new Map();
