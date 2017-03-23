const {obj2getstr} =require("convert");
const {getIndexPage} =require("pageInfo");


// 执行跳转
const to=(url,obj={},conf={bak:false})=>{
        //将需要传输的值中的“=”替换
        for(let key in obj){
          if(obj.hasOwnProperty(key)){
            let value=obj[key];
            if(value){
              if(/\=+/.test(value.toString())){
                obj[key]=value.replace(/\=+?/g,"!*!");
              }
            }
          }
        }
        //Obj 类型转换成的QueryString
        let query_str = obj2getstr(obj);
        url=query_str?[url,"?",query_str].join(""):url;

        //根据Url保存对应的dataStatus 用于回调
        if(conf.bak){

          if(conf.data.hasOwnProperty("__webviewId__")){
            delete conf.data["__webviewId__"];
          }

          getApp().setBak(getIndexPage(),conf.data);
        }

        wx.navigateTo({
          url,
          success: function(res){
            // success
          },
          fail: function() {
     
            // fail
          },
          complete: function() {
            // complete
          }
        })
}

//
const rto=(url,obj={},conf={bak:false})=>{
        //将需要传输的值中的“=”替换
        for(let key in obj){
          if(obj.hasOwnProperty(key)){
            let value=obj[key];
            if(value){
              if(/\=+/.test(value.toString())){
                obj[key]=value.replace(/\=+?/g,"!*!");
              }
            }
          }
        }
        //Obj 类型转换成的QueryString
        let query_str = obj2getstr(obj);
        url=query_str?[url,"?",query_str].join(""):url;

        //根据Url保存对应的dataStatus 用于回调
        if(conf.bak){

          if(conf.data.hasOwnProperty("__webviewId__")){
            delete conf.data["__webviewId__"];
          }

          getApp().setBak(getIndexPage(),conf.data);
        }

        wx.redirectTo({
          url,
          success: function(res){
            // success
          },
          fail: function() {
        
            // fail
          },
          complete: function() {
            // complete
          }
        })
}


module.exports={
    to,
    rto
}