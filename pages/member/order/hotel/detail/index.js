// 引入调用接口类
let Jrequest = require("../../../../../api/request.js");
let JDate = require("../../../../../utils/JDate.js");
let {rto,to} = require("../../../../../utils/navigate.js");
let {swichStartType, switchPriceType} = require("../../../../hotel/common/hotelConvert.js");
const md5 = require("../../../../../utils/md5.js");

Page({
  // 去支付页面
  goPay() {
    let TimeStamp = +new JDate();

    let JSJID,data;

    let {OrderID,TotalPrice,HotelName,RoomName,ArrivalTime,CheckoutTime}=this.data.hotelDateil;
    data={OrderID,TotalPrice,HotelName,RoomName};

    let StartDate=new JDate(ArrivalTime).Date2Json();
    let EndDate=new JDate(CheckoutTime).Date2Json();

    let totalDays=new JDate().getIntervalDay(new JDate(ArrivalTime).Date2Str(),new JDate(CheckoutTime).Date2Str());
    
    try {
      JSJID = wx.getStorageSync('jsjid');
    } catch (error) {};

    let Sign = md5.hex_md5(`JSJID=${JSJID}&OrderNumber=${data.OrderID}&PaymentAmount=${data.TotalPrice.toFixed(2)}&PayToken=VVDDD&TimeStamp=${TimeStamp}&`).toUpperCase();

    let aa = {
      OrderNumber: data.OrderID, PaymentAmount: data.TotalPrice.toFixed(2), TimeStamp, Sign, Ext: JSON.stringify({
        hotelname: data.HotelName, roomname: data.RoomName, inTime: `${StartDate.month}月${StartDate.date}日-${EndDate.month}月${EndDate.date}日共${totalDays}晚`
      })
    };
    to("../../../pay/index", aa);
  },
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

    let CustomerId;

    try {
      CustomerId = wx.getStorageSync('jsjid');
    } catch (error) { }

    new Jrequest("HotelApi").get("_CancelOrder", { OrderID: orderid, CustomerId }, data => {
      if (data.BaseResponse.Code == 1) {

        wx.showModal({
          title: '提示',
          content: "取消成功",
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            rto("../list/index", {});
          }
        });


      } else {

        wx.showModal({
          title: '提示',
          content: "取消失败",
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            rto("../list/index", {});
          }
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
    console.log(JSON.stringify(options));
    // options={"orderid":"8618582"};
    // 生命周期函数--监听页面加载
    this.setData(Object.assign(this.data, {
      DetailIsShow: false//初始详情价格隐藏 
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