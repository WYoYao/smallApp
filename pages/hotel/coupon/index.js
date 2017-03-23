
let app = getApp();
let CustomerId;
let data;

Page({

  getPrevData() {
    if (data) return data;

    let routers = getCurrentPages();
    let url = routers[routers.length - 2].__route__;
    return app.globalData.bak.get(url);
  },
  // 获取 CustomerId
  getCustomerId() {

    if (!CustomerId) {
      CustomerId = wx.getStorageSync("jsjid");
    }

    return CustomerId;
  },
  // 向订单的页面添加对应的优惠券
  pushCoupon(item) {


    let data = this.getPrevData().state;

    let CodeCoupons = {};

    CodeCoupons.CouponsId = item.CouponID;
    CodeCoupons.CouponsNo = item.CouponCode;
    CodeCoupons.CustomerId = this.getCustomerId();
    CodeCoupons.CouponsType = item.CouponType;
    CodeCoupons.CouponsPrice = item.CouponValue;
    CodeCoupons.CouponsFullPrice = item.CouponUpperLimit;
    CodeCoupons.PriceType = 1;
    CodeCoupons.CouponsPriceConfirm = item.CouponValue;
    CodeCoupons.index = item.index;
    CodeCoupons.RoomRMDY = item.HotelCouponDetails.RoomRMDY;
    //赋值
    data.HotelOrderCouponsUsedList ? data.HotelOrderCouponsUsedList.push(CodeCoupons) : data.HotelOrderCouponsUsedList = [CodeCoupons];

  },
  //选中优惠券
  bindcheckCoupon(e) {

    let HotelOrderCouponsUsedList = this.getPrevData().state.HotelOrderCouponsUsedList || [];

    let selectIndex = e.currentTarget.dataset.id || 0;

    let couponList = this.data.couponList;

    let {num, price, commission} = this.data.model;

    // 获取对应的优惠券的信息
    let json = this.data.couponList.filter((item, index) => index == selectIndex)[0] || {};

    // 选中事件
    json.index = selectIndex;

    // 取消选中事件
    if (json.selected) {
      let state = this.getPrevData().state;
      HotelOrderCouponsUsedList = HotelOrderCouponsUsedList.filter(item => item.index != selectIndex);
      this.getPrevData().state.HotelOrderCouponsUsedList = HotelOrderCouponsUsedList;
    } else {
      // 没有找到对应的优惠券  取消点击事件
      if (!json) return;
      // 佣金小于30 直接过滤调
      if (commission < 30) {
 
        return;
      }

      let valiteRMDY = (jsons, HotelOrderCouponsUsedLists) => {
        if (jsons.HotelCouponDetails.RoomRMDY <= (this.data.model.num - HotelOrderCouponsUsedLists.reduce((content, item) => {
          content += item.RoomRMDY;
          return content;
        }, 0))) {
          return true;
        } else {
          return false;
        }
      }
      let result;

      // 根据的价格判断
      if (20 == json.CouponValue && price >= 300) {
        result = valiteRMDY(json, HotelOrderCouponsUsedList);

      } else if (20 < json.CouponValue < 30 && price >= 500) {
        result = valiteRMDY(json, HotelOrderCouponsUsedList);
      } else if (30 == json.CouponValue && price >= 500) {
        result = valiteRMDY(json, HotelOrderCouponsUsedList);
      } else if (70 == json.CouponValue && price >= 500) {
        result = valiteRMDY(json, HotelOrderCouponsUsedList);
      }
      if (!result) {

        return;
      }

      // 添加到对应的订单中
      this.pushCoupon(json);

      if (this.data.model.num ==  this.getPrevData().state.HotelOrderCouponsUsedList.reduce((content, item) => {
        content += item.RoomRMDY;
        return content;
      }, 0)) {
        wx.navigateBack({ delta: 1 });
      }


    }




    // 修改代金券的状态
    couponList[selectIndex].selected = !couponList[selectIndex].selected;
    this.setData({
      couponList
    });

  },
  // 切换的显示面板
  toggleBlock(e) {
    // 切换对应的页面
    let togglePage = e.currentTarget.dataset.index || 0;

    this.setData({
      view: Object.assign({}, this.data.view, { togglePage })
    })

  },
  data: {
    view: {
      togglePage: 0,
    },
    couponList: [],
    couponUsed: [],
  },
  onLoad: function (options) {


    this.setData({
      model: Object.assign({}, options)
    })

    // 生命周期函数--监听页面加载
    wx.getStorage({
      key: 'GetCoupon',
      success: (res) => {

  
        let arr = this.getPrevData().state.HotelOrderCouponsUsedList || [];
        arr.map(item => item.index).forEach(index => {

          res.data[index].selected = true;
        })
        this.setData({
          couponList: res.data || []
        })

      },
      fail: (res) => {
     
      }
    });

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