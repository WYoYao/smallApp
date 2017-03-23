// 引入调用接口类
let Jrequest = require("../../../api/request.js");
let JDate = require("../../../utils/JDate.js");
let {to} = require("../../../utils/navigate.js");
let {swichStartType, switchPriceType} = require("../../hotel/common/hotelConvert.js");

Page({
  getHotelDetail: function (orderId) {
    let CustomerId=wx.getStorageSync("jsjid");
    new Jrequest("HotelApi").get("_GetOrderDetail", { OrderID: orderId,CustomerId }, data => {
      if (data.BaseResponse.Code == 1) {
        let hotelDateil = data;
        hotelDateil.OrderStatus = this.Status[hotelDateil.OrderStatusID];
        hotelDateil.HotelStar = swichStartType(hotelDateil.HotelStarId);
        hotelDateil.Currency = switchPriceType(hotelDateil.CurrencyId);
        hotelDateil.GuarantyType = this.GuarantyType[hotelDateil.GuarantyTypeID];
        hotelDateil.PymtMeans = this.PymtMeans[hotelDateil.PymtMeansID];
        hotelDateil.Remarks = (hotelDateil.Remarks == "" ? "无" : hotelDateil.Remarks);

        this.setData(Object.assign(this.data, {
          hotelDateil: hotelDateil,
        }));
      } else {

      }
    });
  },
  //跳转酒店
  JumpPageHotel: function (event) {
    to("../detail/index", { "orderid": event.currentTarget.dataset.orderid });
  },
  //取消订单
  CancelOrder: function (event) {

    let orderid = event.currentTarget.dataset.orderid;

    let  CustomerId = wx.getStorageSync('jsjid');

    new Jrequest("HotelApi").get("_CancelOrder", { OrderID: orderid, CustomerId }, data => {
      if (data.BaseResponse.Code == 1) {

        wx.showModal({
                    title: '提示',
                    content: "取消成功",
                    showCancel: false,
                    confirmText: "确定",
                    success: (res) => {
                      this.getHotelDetail(orderid);
                     }
        });
      } else {
        wx.showModal({
                    title: '提示',
                    content: "取消失败",
                    showCancel: false,
                    confirmText: "确定",
                    success: function (res) { }
        });
      }
    });

  },
  //显示隐藏详细价格
  ISShow: function () {
    this.setData(Object.assign(this.data, {
      DetailIsShow: !this.data.DetailIsShow
    }));
  },
  Status: ["", "待确认", "已确认", "已完成", "未入住", "已取消", "待支付"],
  /*付款方式*/
  PymtMeans: ["", "前台现付", "预付", "预付"],
  /*担保类型*/
  GuarantyType: ["", "无担保", "其他", "未担保"],
  data: {
  },
  onLoad: function (options) {
    new Jrequest("WXBindAPI").get("_Counts",{
       business:0,
       viewname:"successful"
      },data=>{
     })
    // 生命周期函数--监听页面加载
    this.setData(Object.assign(this.data, {
      DetailIsShow: false,//初始详情价格隐藏
      isPay:options.isPay,
    }));
    this.getHotelDetail(options.orderid);
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