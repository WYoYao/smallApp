// 引入调用接口类
let Jrequest = require("../../../../api/request.js");
let {to} = require("../../../../utils/navigate.js");
let interval = "";
Page({
  data: {
  },
  //注册
  registered: function (event) {
    let index = event.currentTarget.dataset.index;
    //验证手机号
    if (!this.IsMobile(this.data.mobile)) {
      this.setData(Object.assign(this.data, {
        index: 0,
        confirm_status: false,
        confirm_Message: "手机号格式错误",
      }))
      return;
    }
    //【验证是否注册】
    new Jrequest("JUser").get("CheckMobile", { "Mobile": this.data.mobile }, data => {
      if (!data.BaseResponse.IsSuccess) {
        this.setData(Object.assign(this.data, {
          index: 0,
          confirm_status: false,
          confirm_Message: "接口服务异常",
        }))
        return;
      }

      if (data.IsRegist == 1) {
        this.setData(Object.assign(this.data, {
          index: 0,
          confirm_status: false,
          confirm_Message: "手机号已注册",
        }))
        return;
      }

      //【发送验证码】
      let request = { Mobile: this.data.mobile, SendType: 1, IP: "172.16.9.24" };
      new Jrequest("User").get("GetVcode", request, data => {
        if (!data.SendResult) {
          this.setData(Object.assign(this.data, {
            index: 0,
            confirm_status: false,
            confirm_Message: data.SendResultMsg,
          }))
        } else {
          interval = setInterval(() => { this.settime() }, 1000);

          this.setData(Object.assign(this.data, {
            index: index
          }))
        }
      });
    });
  },
  getcode: function (event) {
    //【发送验证码】
    let request = { Mobile: this.data.mobile, SendType: 1, IP: "172.16.9.24" };
    new Jrequest("User").get("GetVcode", request, data => {
      if (!data.SendResult) {
        this.setData(Object.assign(this.data, {
          confirm_status: false,
          confirm_Message: data.SendResultMsg,
        }))
      } else {
        this.setData(Object.assign(this.data, {
          stop: false,//控制显示重新发送
          count: 60,
        }))
        interval = setInterval(() => { this.settime() }, 1000);
      }
    });
  },
  //赋值验证码
  setCode: function (event) {
    let index = event.currentTarget.dataset.index;
    this.setData(Object.assign(this.data, {
      index: index
    }))
  },
  //发送注册
  sendRegistered: function (event) {
    if (this.data.password.length < 6) {
      this.setData(Object.assign(this.data, {
        confirm_status: false,
         index: 2,
        confirm_Message: "密码必须大于六位",
      }))
      return;
    }
    let request = { "Mobile": this.data.mobile, "IdenCode": this.data.code, "IP": "172.16.9.24", "PassWord": this.data.password };
    new Jrequest("JUser").get("RegistByMobile", request, data => {
      if (!data.BaseResponse.IsSuccess) {
        this.setData(Object.assign(this.data, {
          confirm_status: false,
          index: 2,
          confirm_Message: data.BaseResponse.ErrorMessage,
        }))
        return;
      }

      //如果存在说明则提醒
      if (data.BaseResponse.ErrorMessage != "" &&data.BaseResponse.ErrorMessage != null) {
        this.setData(Object.assign(this.data, {
          confirm_status: false,
           index: 2,
          confirm_Message: data.BaseResponse.ErrorMessage,
        }))
        return;
      }
      //保存jsjid
      wx.setStorage({
        key: "jsjid",
        data: data.JSJID
      })
      // //绑定（2017-03-08注释绑定）start
      // let openid = wx.getStorageSync('openid');
      // if (openid != "" && openid != null) {
      //   new Jrequest("JUser").get("WXBindAPI", { openid: openid, jsjid: data.JSJID }, data => {
      //     if (data.BaseResponse.IsSuccess == true && data.JSJID != "") {
      //       //保存jsjid
      //       wx.setStorage({
      //         key: "jsjid",
      //         data: data.JSJID
      //       })
      //     }
      //   });
      // }
      //（2017-03-08注释绑定）end
      to("../../../../../pages/index", {});
    });
  },
  //触发toast
  // toastHide: function () {
  //   this.setData(Object.assign(this.data, {
  //     confirm_status: true
  //   }))
  // },
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
  //逐减
  settime: function () {
    if (this.data.count == 0) {
      this.setData(Object.assign(this.data, {
        stop: true//控制显示重新发送
      }));
      clearInterval(interval);
    } else {
      let jcount = this.data.count - 1;
      this.setData(Object.assign(this.data, {
        count: jcount
      }));
    }
  },
  //手机号
  bindKeyMobile: function (event) {
    let mobile = "";
    if (!isNaN(event.detail.value)) {
      mobile = event.detail.value;
    } else {
      mobile = event.detail.value.substring(0, event.detail.value.length - 1);
    }
    this.setData(Object.assign(this.data, {
      mobile: mobile
    }))
  },
  ///验证码
  bindKeyCode: function (event) {
    this.setData(Object.assign(this.data, {
      code: event.detail.value
    }))
  },
  //密码
  bindKeypassword: function (event) {
    this.setData(Object.assign(this.data, {
      password: event.detail.value
    }))
  },
  //验证手机号
  IsMobile: function (str) {
    if (str.length != 11) return false;
    let reg0 = /^1[3578]\d{5,9}$/;
    let my = false;
    if (reg0.test(str)) { my = true };
    return my;
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData(Object.assign(this.data, {
      index: 0,
      count: 60,
      stop: false,//控制显示重新发送
      confirm_status: true//confirm隐藏
    }));
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