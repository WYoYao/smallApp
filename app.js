let Jrequest = require("api/request.js");
const getIndexPage = require("./utils/pageInfo.js");
/**
 * onLoad 装饰器
 */
let BranchPage = Page;
Page = function (obj) {
  let onLoad = obj.onLoad;
  let onShow = obj.onShow;
  obj.onLoad = function (options) {


    //修改的微信在传值的时候修改替换的 ==
    for (let key in options) {

      if (options.hasOwnProperty(key)) {
        let value = options[key];
        if (/(\!\*\!)+/.test(value.toString())) {
          options[key] = value.replace(/(\!\*\!)+?/g, "=");
        }
      }
    }



    onLoad.call(this, options);
  };

  obj.onShow = function () {
    //判断之前是否有为当前页面保存状态值
    if (getApp().globalData.bak.has(this.__route__)) {

      this.setData(getApp().globalData.bak.get(this.__route__));
      getApp().globalData.bak.delete(this.__route__);
    }

    onShow.call(this);
  }

  obj.onShareAppMessage = function () {
    // 用户点击右上角分享
    return {
      title: '金色世纪商旅网', // 分享标题
      desc: '金色世纪商旅网，商旅管家 全程无忧。提供酒店预定、贵宾厅查询。', // 分享描述
      path: 'pages/index' // 分享路径
    }
  };
  let newPage = BranchPage(obj);
}

App({
  onLaunch: function () {

    //调用API从本地缓存中获取数据  添加日志
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // Do something initial when launch.
    wx.login({
      success: function (res) {

        if (res.code) {
          //发起网络请求
          new Jrequest("WXBindAPI").get("_GetJSJID", { code: res.code }, data => {
            if (data.BaseResponse.IsSuccess == true && data.JSJID != "") {
              // //保存jsjid 注释绑定（2017-03-08） start
              // if (data.JSJID) {
              //   wx.setStorage({
              //     key: "jsjid",
              //     data: data.JSJID
              //   })
              // }
              //保存openid
              wx.setStorage({
                key: "openid",
                data: data.OPENID
              })
            } 
          });
        }
      }
    });
  },
  onShow: function () {

    // Do something when show.
  },
  onHide: function () {

    // Do something when hide.
  },
  onError: function (msg) {

  },
  // 获取用户信息方法
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              // 获取用户的信息，将内容保存的全局变量中
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //用户执行登陆操作   (需要再第一个页面执行)
  login() {
    return;
    wx.login({
      success: function (res) {
  
        if (res.code) {
          //发起网络请求
          new Jrequest("WXBindAPI").get("_GetJSJID", { code: res.code }, data => {
   
            if (data.BaseResponse.IsSuccess == true && data.JSJID != "") {
              // //保存jsjid  //注释绑定（2017-03-08）
              // if (data.JSJID) {
              //   wx.setStorage({
              //     key: "jsjid",
              //     data: data.JSJID
              //   })
              // }
              //保存openid
              wx.setStorage({
                key: "openid",
                data: data.OPENID
              })

            } else {


            }
          });
        }
      }
    });
  },
  //全部变量需要保存的内存中的值保存
  globalData: {
    //用户信息
    userInfo: null,
    //回调页面的变量值保存
    bak: new Map()
  },
  // 用于保存数据请求
  Cache: {

  },
  //页面的回调之前保存当前页面的值
  setBak(key, value) {
    this.globalData.bak.set(key, value);
  }
  // 写入
})


