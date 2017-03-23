// 引入调用接口类
let Jrequest = require("../../../api/request.js");
const {to,rto} = require("../../../utils/navigate.js");
Page({
    data:{
    },
    pay: function(){
        this.setData({
            buttonclick:true
        });
        // if (this.data.OPENID != "" && this.data.OPENID  != null) {
            new Jrequest("WXBindAPI").get("WXPay", this.data, result => {
                result = JSON.parse(result);
                if (result.Issuccess != undefined) {
                    //发起微信支付
                    wx.requestPayment({
                        'timeStamp': result.timestamp,
                        'nonceStr': result.nonceStr,
                        'package': result.package,
                        'signType': result.signType,
                        'paySign': result.paySign,
                        'success':res=> {
                            if(res.errMsg == "requestPayment:ok"){
                                //支付成功
                                rto("../../hotel/successful/index", { "orderid": this.data.OrderNumber,"isPay":1 });
                            }
                        },
                        'fail':res=>{
                            //取消支付
                            if (res.errMsg == "requestPayment:fail cancel") {
                                this.setData({
                                    buttonclick:false
                                });
                            }
                            //支付失败
                            else {
                                 wx.showModal({
                                    title: '提示',
                                    content: res.errMsg,
                                    showCancel: false,
                                    confirmText: "确定",
                                    success: (res) => {
                                        this.setData({
                                            buttonclick:false
                                        });
                                    }
                                 });
                            }
                        }
                    });
                }
                else{
                    wx.showModal({
                        title: '提示',
                        content: result.BaseResponse.ErrorMessage,
                        showCancel: false,
                        confirmText: "确定",
                        success: (res) => {
                            this.setData({
                                buttonclick:false
                            });
                        }
                     }); 
                }
            });
        //}
    },
    onLoad: function (options) {
       
        // 生命周期函数--监听页面加载
        options.Ext=JSON.parse(options.Ext);
        let openid = wx.getStorageSync('openid');
        let jsjid = wx.getStorageSync('jsjid');
        this.setData(Object.assign(options, {
            OPENID:openid,JSJID:jsjid,buttonclick:false
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
});



