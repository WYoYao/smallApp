
const { get_type, valiteObject } = require("../utils/valite.js");
const md5 = require("../utils/md5.js");
const JDate = require("../utils/JDate.js");
const conf = require("./conf.js");

class Jrequest {
    constructor(key) {
        if (!conf[key]) throw new Error("key not find");
        let {SignatureKey, url, BaseRequest} = conf[key];
        return Object.assign(this, { SignatureKey, url, BaseRequest });
    }
    get(MethodName, Json = {}, cb, conf = { isCache: false }) {

        let app = getApp();

        if (get_type(MethodName) != "String") throw new Error("MethodName must be a String");

        if (!Json || get_type(Json) != "Object") throw new Error("Json must be an Object");

        if (!cb || get_type(cb) != "Function") throw new Error("cb must be a Function");

        // 请求的数据可以进行缓存
        if (conf.isCache) {


            app.Cache[MethodName] = app.Cache[MethodName] || new Map();
            // 获取的Chache 没有给默认值
            let map = app.Cache[MethodName];

            for (let key of map.keys()) {

                if (valiteObject(key, Json)) {
          
                    cb(map.get(key));
                    return;
                }
            }

        }

        let reqJson = Object.assign({}, Json, { BaseRequest: this.BaseRequest });
        console.log(JSON.stringify(reqJson));
        //时间戳
        let Timestamp = Date.now();

        let Sign = md5.hex_md5(JSON.stringify(reqJson) + MethodName + Timestamp + this.SignatureKey);
       

        //发送微信请求
        wx.request({
            url: this.url,
            data: {
                MethodName,
                Json: reqJson,
                Sign,
                Timestamp
            },
            method: "post",
            header: {
                "Content-Type": "application/json"
            },
            success: function (res) {
                if (res.statusCode == 200) {

                    if (res.data.IsSuccess) {

                        if (conf.isCache) {
    
                            app.Cache[MethodName] = app.Cache[MethodName] || new Map();
                            //如果设置了缓存数据返回的时候缓存接口返回的信息
                            app.Cache[MethodName].set(Json, res.data.Json);
                        }

                        cb(res.data.Json)
                    } else {
                        throw new Error('Server Error ' + res.data.ExceptionMessage)
                    }

                } else {
                    throw new Error('Request "' + this.Url + '" failed');
                }
            },
            fail: function () {
                console.log(JSON.stringify(arguments));
            },
            complete: function () {
            }
        })

    }
}

module.exports = Jrequest;


