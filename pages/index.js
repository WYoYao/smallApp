let {rto,to} = require("../utils/navigate.js");
let Jrequest = require("../api/request.js");

Page({
  data: {
  },

  to_hotel: function (event) {
    rto("hotel/index/index", this.data);
  },
  to_viphall: function (event) {
    to("viphall/index/index", this.data);
  },
  to_order: function (event) {
    to("member/order/hotel/list/index", this.data);
  },
  onLoad: function (options) {

    new Jrequest("WXBindAPI").get("_Counts",{
       business:0,
       viewname:"index"
      },data=>{
     })

    let _that=this;
    try {
      let jsjid=wx.getStorageSync("jsjid") || false;
      _that.setData({jsjid});
    } catch (error) {
      
    }
    // 生命周期函数--监听页面加载

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