
// 引入调用接口类
let Jrequest = require("../../../../../api/request.js");
let JDate = require("../../../../../utils/JDate.js");
let {to} = require("../../../../../utils/navigate.js");
const {isLogin} = require("../../../../../utils/CheckLogin.js");

Page({
  getHotelList: function (startTime = "", endTime = "") {

    let CustomerId;

    try {
      CustomerId = wx.getStorageSync('jsjid');
    } catch (error) {}

    let request = { CustomerId, StartTime: startTime, EndTime: endTime };
    new Jrequest("HotelApi").get("_GetOrderList", request, data => {
      if (data.BaseResponse.Code == 1) {
        let hotelList = data.OrderList.map(item => {
          item.OrderStatus = this.Status[item.OrderStatusID];
          item.Days = new JDate().getIntervalDay(item.ArrivalTime, item.CheckoutTime);
          item.IntervalDays = new JDate().getIntervalDay(new JDate(new Date()).Date2Str(), item.CheckoutTime);
          return item;
        });

        this.setData(Object.assign(this.data, {
          hotelList: hotelList,
          listLength: hotelList.length
        }));
      } else {
        this.setData(Object.assign(this.data, {
          hotelList: [],
          listLength: 0
        }));
      }
    });
  },
  JumpPage: function (event) {
    to("../detail/index", { "orderid": event.currentTarget.dataset.orderid });
  },
  Switch: function (event) {
    this.setData(Object.assign(this.data, {
      checkIndex: event.currentTarget.dataset.index
    }));

    if (event.currentTarget.dataset.index == 1) {
      this.getHotelList(this.data.StartTime, this.data.EndTime);
    } else if (event.currentTarget.dataset.index == -1) {
      this.getHotelList("", "");
    }
  },
  data: {
  },
  Status: ["", "待确认", "已确认", "已完成", "未入住", "已取消", "待支付", "已退款"],
  onLoad: function (options) {
    isLogin();
    //当前时间
    let currentTime = new JDate(new Date()).Date2Str();

    // 生命周期函数--监听页面加载
    let StartTime = new JDate(new JDate().lessDate(60)).Date2Str();
    let EndTime = currentTime;
    this.setData({ StartTime: StartTime, EndTime: EndTime, checkIndex: 1 });

    this.getHotelList(this.data.StartTime, this.data.EndTime);
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