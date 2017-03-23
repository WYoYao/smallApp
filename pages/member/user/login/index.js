// 引入调用接口类
let Jrequest = require("../../../../api/request.js");
let {rto} = require("../../../../utils/navigate.js");


let interval = "";
Page({
  data: {
  },

  onLoad: function (options) {

    try {wx.setStorageSync('checking', false)} catch (e) {}

    // 生命周期函数--监听页面加载
    this.setData(Object.assign(this.data, {
      checkIndex: -1, //初始账号登陆
      confirm_status: true,//confirm隐藏
      codeMessage: "获取验证码"
    }));
  },
  //menu切换
  switch: function (event) {
    this.setData(Object.assign(this.data, {
      checkIndex: event.currentTarget.dataset.index
    }));
  },
  //登录
  login: function () {

    if (this.data.checkIndex == -1) {
      if (this.data.loginName == "" || this.data.loginName == undefined) {
        this.setData(Object.assign(this.data, {
          confirm_status: false,
          confirm_Message: "请输入账号"
        }));
        return;
      }
      if (this.data.passWord == "" || this.data.passWord == undefined) {
        this.setData(Object.assign(this.data, {
          confirm_status: false,
          confirm_Message: "请输入密码"
        }));
        return;
      }
      //【普通登录】
      let request = { Mobile: this.data.loginName, PassWord: this.data.passWord };
      new Jrequest("JUser").get("Login", request, data => {
        if (!data.BaseResponse.IsSuccess) {
          this.setData(Object.assign(this.data, {
            confirm_status: false,
            codeMessage: data.BaseResponse.ErrorMessage
          }));
          return;
        }
        //保存jsjid
        wx.setStorage({
          key: "jsjid",
          data: data.JSJID
        });

        if (data.MemberLoginResult == 0) {
          wx.navigateBack({ delta: 1 });
          // //绑定（2017-03-08注释绑定）start
          // let openid = wx.getStorageSync('openid');
          // if (openid != "" && openid != null) {

          //   new Jrequest("WXBindAPI").get("UserBind", { openid: openid, jsjid: data.JSJID }, data => {
          //     if (data.BaseResponse.IsSuccess == true && data.JSJID != "") {
          //     }
          //     wx.navigateBack({ delta: 1 });
          //   });
          // }else{
          //   wx.navigateBack({ delta: 1 });
          // }
          //（2017-03-08注释绑定) end
          //todo:跳转
          // this.setData(Object.assign(this.data, {
          //   confirm_status: false,
          //   confirm_Message: "登录成功跳转"
          // }));
        } else {
          this.setData(Object.assign(this.data, {
            confirm_status: false,
            confirm_Message: data.BaseResponse.ErrorMessage
          }));
        }

      });
    } else if (this.data.checkIndex == 1) {
      if (this.data.tel == "" || this.data.tel == undefined) {
        this.setData(Object.assign(this.data, {
          confirm_status: false,
          confirm_Message: "请输入手机号"
        }));
        return;
      }
      if (this.data.code == "" || this.data.code == undefined) {
        this.setData(Object.assign(this.data, {
          confirm_status: false,
          confirm_Message: "请输入验证码"
        }));
        return;
      }

      //【验证码登录】
      let request = { Mobile: this.data.tel, IdenCode: this.data.code, IP: "172.16.9.24" };
      new Jrequest("JUser").get("LoginIdenCode", request, data => {
        if (!data.BaseResponse.IsSuccess) {
          this.setData(Object.assign(this.data, {
            confirm_status: false,
            codeMessage: data.BaseResponse.ErrorMessage
          }));
          return;
        }

        //保存jsjid
        wx.setStorage({
          key: "jsjid",
          data: data.JSJID
        })

        if (data.MemberLoginResult == 0) {
          // //绑定（2017-03-08注释绑定）start
          // let openid = wx.getStorageSync('openid');
          // if (openid != "" && openid != null) {
          //   new Jrequest("WXBindAPI").get("UserBind", { openid: openid, jsjid: data.JSJID }, data => {
          //     if (data.BaseResponse.IsSuccess == true && data.JSJID != "") {
          //     }
          //     wx.navigateBack({ delta: 1 });
          //   });
          // }
          //绑定（2017-03-08注释绑定）end
          
          //todo:跳转
          // this.setData(Object.assign(this.data, {
          //   confirm_status: false,
          //   confirm_Message: "登录成功跳转"
          // }));
        } else {
          this.setData(Object.assign(this.data, {
            confirm_status: false,
            confirm_Message: data.BaseResponse.ErrorMessage
          }));
        }
      });
    }
  },
  //获取验证码
  getCode: function () {
    //验证手机号
    if (!this.IsMobile(this.data.tel)) {
      this.setData(Object.assign(this.data, {
        confirm_status: false,
        confirm_Message: "手机号格式错误",
      }))
      return;
    }

    //【发送验证码】
    let request = { Mobile: this.data.tel, SendType: 2, IP: "172.16.9.24" };
    new Jrequest("User").get("GetVcode", request, data => {
      if (!data.SendResult) {
        this.setData(Object.assign(this.data, {
          confirm_status: false,
          confirm_Message: "验证码发送失败",
        }))
      } else {
        interval = setInterval(() => { this.settime() }, 1000)
      }
    });
  },

  //逐减
  settime: function () {
    if (this.data.codeMessage == "获取验证码") {
      this.setData(Object.assign(this.data, {
        codeMessage: 60
      }));
    }
    if (this.data.codeMessage == 1) {
      this.setData(Object.assign(this.data, {
        codeMessage: "获取验证码"
      }));
      clearInterval(interval);
    } else {
      let jcount = this.data.codeMessage - 1;
      this.setData(Object.assign(this.data, {
        codeMessage: jcount
      }));
    }
  },
  //验证码
  bindKeyCode: function (event) {
    this.setData(Object.assign(this.data, {
      code: event.detail.value
    }));
  },
  //验证手机号
  IsMobile: function (str) {
    if (str.length != 11) return false;
    let reg0 = /^1[3578]\d{5,9}$/;
    let my = false;
    if (reg0.test(str)) { my = true };
    return my;
  },
  //赋值登陆账号
  bindKeyloginName: function (event) {
    this.setData(Object.assign(this.data, {
      loginName: event.detail.value
    }))
  },
  //赋值密码
  bindKeypassWord: function (event) {
    this.setData(Object.assign(this.data, {
      passWord: event.detail.value
    }))
  },
  //赋值手机号
  bindKeytel: function (event) {
    let tel = "";
    if (!isNaN(event.detail.value)) {
      tel = event.detail.value;
    } else {
      tel = event.detail.value.substring(0, event.detail.value.length - 1);
    }
    this.setData(Object.assign(this.data, {
      tel: tel
    }))
  },
  goRegistered: function (event) {
    rto("../registered/index", {});
  },
  // 确定弹层
  confirmClick: function () {
    this.setData(Object.assign(this.data, {
      confirm_status: true
    }))
  },
  // 取消弹层
  cancelClick: function () {
    this.setData(Object.assign(this.data, {
      confirm_status: true
    }))
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})