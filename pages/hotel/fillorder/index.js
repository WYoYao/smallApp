// 引入调用接口类
const Jrequest = require("../../../api/request.js");

const md5 = require("../../../utils/md5.js");

const {to, rto} = require("../../../utils/navigate.js");
// 页面需要的转换类型
const {swichStartType, switchPriceType, switchBreakfastNum, swichWIFI} = require("../common/hotelConvert.js");

const JDate = require("../../../utils/JDate.js");

const {isLogin} = require("../../../utils/CheckLogin.js");

let JSJID;


/**
             * 0 满放
             * 1 现付
             * 2 预付
             * 3 担保
             */

// 创建最晚到点时间的的数组
function createArriveTime() {

  let day = new JDate(), hours = day.getHours(), minutes = day.getMinutes();
  //不满的14点的计算
  minutes = hours <= 12 ? 0 : minutes;
  hours = hours <= 12 ? 14 : hours;
  hours++;
  hours += minutes >= 30 ? 1 : 0;

  day = day.setMinute(0);

  let arr = [];

  //循环遍历出的全部的字符的串数组
  while (hours <= 30) {

    if (hours < 24) {

      arr.push({
        key: `${hours}:00 前`,
        value: new JDate(day.setHour(hours).setMinutes(0)).Date2Str()
      });

    } else if (hours == 24) {

      arr.push({
        key: `23:59 前`,
        value: `${day.Date2shortStr()} 24:00:00`,
      });

    } else if (hours <= 30) {

      arr.push({
        key: `次日 ${hours - 24}:00 前`,
        value: new JDate(day.addDate(1).setHour(hours - 24).setMinutes(0)).Date2Str()
      });

    }

    hours++;
  }

  return arr;

};


function DateList(StartDate, EndDate) {
  StartDate = +new JDate(StartDate);
  EndDate = +new JDate(EndDate);
  var _arr = [StartDate];
  while (StartDate < EndDate) {
    _arr.push(StartDate);
    StartDate = StartDate + (1000 * 60 * 60 * 24);
  }
  return _arr.map(function (item) {
    return new JDate(parseInt(item));
  })
}

Page({
  // 展示价格详情
  eventShowRriceDetail() {
    this.setData({
      view: Object.assign({}, this.data.view, { show_price_detail: !this.data.view.show_price_detail })
    })
  },
  // 隐藏价格详情
  hideRriceDetail() {
    this.setData({
      view: Object.assign({}, this.data.view, { show_price_detail: true })
    })
  },
  // 跳转到担保的页面
  showGurantee() {

    if (this.data.userList.filter(item => {

      return !((item.GuestNames || "").toString().length);
    }).length) {
      wx.showModal({
        title: '提示',
        content: '请填写入住人信息',
        showCancel: false,
        confirmText: "确定",
        success: function (res) {

        }
      });
      return false;
    }

    to("../guarantee/index", {}, { bak: true, data: this.data });
  },
  // 判断是否是担保订单
  isGetOrderGuranteeInfo() {
    // if (this.data.RoomPayType != 3) return;
    let Gurantee = this.data.GuranteeInfo;
    let isGurantee = false;
    if (Gurantee.IsGuarantee) {
      // 将入离日期转换成时间搓进行比较
      let StartDate = +new JDate(this.data.state.StartDate),
        EndDate = +new JDate(this.data.state.EndDate);
      // 担保信息中的入离日期
      let gStartDate = +new JDate(Gurantee.StartDate),
        gEndDate = +new JDate(Gurantee.EndDate);

      // 判断用户入离日期实在在担保范围内
      if ((gStartDate <= StartDate && StartDate < gEndDate) || (gStartDate <= EndDate && EndDate < gEndDate) || (StartDate <= gStartDate && EndDate < gEndDate)) {
        // 判断星期 连续时间段中有一天是在规定的星期天数中

        if (DateList(StartDate, EndDate).filter(function (item) {

          return Gurantee.WeekSet.indexOf(item.getDay()) != -1;
        }).length) {

          // 查看到店时间是否为担保 如果需要担保验证到店时间的担保
          if (Gurantee.IsTimeGuarantee) {

            let LatestArrivalTimeJSON = new JDate(this.data.state.LatestArrivalTime).Date2Json();

            var num = +LatestArrivalTimeJSON.hours * 100 + (+LatestArrivalTimeJSON.minutes);
            if (+LatestArrivalTimeJSON.date > new JDate().getDate()) {
              num += 2400;
            }

            if (+Gurantee.StartTime.replace(':', '') <= num && num <= +Gurantee.EndTime.replace(':', '')) {

              isGurantee = true;
            }
          } else if (Gurantee.IsAmountGuarantee) {
            if (this.data.state.RoomNum > Gurantee.Amount) {

              isGurantee = true;
            }
          } else {
            isGurantee = true;
          }
        }
      }

    }

    this.setData({
      view: Object.assign({}, this.data.view, {
        GuranteeInfoPrice: this._viewGuranteeInfo()
      })
    });


    return isGurantee;

  },
  //跳转到对应的优惠券页面
  GoCoupon() {

    //房间数
    let num = this.data.state.RoomNum * ((new JDate(this.data.state.CheckoutTime) - new JDate(this.data.state.ArrivalTime)) / (24 * 60 * 60 * 1000));
    //最低价格
    let price = this.data.RoomPrice.ListRoomPrice.sort((a, b) => a.MemberPrice - b.MemberPrice)[0].MemberPrice || 1;
    //最低返现
    let commission = this.data.RoomPrice.ListRoomPrice.sort((a, b) => a.Commission - b.Commission)[0].Commission || 0;

   
    to("../coupon/index", { num, price, commission }, { bak: true, data: this.data });
  },
  // 页面初始化
  pageInit() {

    // 保存全局变量JSJID
    JSJID = wx.getStorageSync('jsjid');

    // 调用接口 
    // 获取会员信息
    this._GetUserInfoByJSJID(() => {
      // 获取每日房型价格
      this._GetRoomPrice();
    });

    if (this.data.RoomPayType == 2) {
      // 获取优惠券信息

      this.GetCoupon();

    }

  },
  // 绑定联系人手机号
  bindInputRemark(e) {
    let value = e.detail.value;
    this.setData(Object.assign(this.data.state, {
      RemarksToHotel: value
    }));
  },
  // 绑定联系人手机号
  bindInputTel(e) {
    let value = e.detail.value;
    this.setData(Object.assign(this.data.state, {
      Contact: {
        ContactMobile: value
      }
    }))
  },
  // 去支付页面
  goPay(data) {
    let TimeStamp = +new JDate();

    let Sign = md5.hex_md5(`JSJID=${JSJID}&OrderNumber=${data.OrderID}&PaymentAmount=${data.TotalPrice.toFixed(2)}&PayToken=VVDDD&TimeStamp=${TimeStamp}&`).toUpperCase();

    let aa = {
      OrderNumber: data.OrderID, PaymentAmount: data.TotalPrice.toFixed(2), TimeStamp, Sign, Ext: JSON.stringify({
        hotelname: this.data.HotelName, roomname: this.data.view.RoomName, inTime: `${this.data.StartDate.Month}月${this.data.StartDate.Day}日-${this.data.EndDate.Month}月${this.data.EndDate.Day}日共${this.data.totalDays}晚`
      })
    };

    to("../../member/pay/index", aa);

  },
  //提交订单
  bingCommitOrder() {
   
    if (this.data.disabled) {
      return;
    }
 
    this.setData({ disabled: true });

    if (this.data.userList.filter(item => !item.GuestNames).length) {
      this.setData({ disabled: false });
      wx.showModal({
        title: '提示',
        content: "请输入入住人信息",
        showCancel: false,
        confirmText: "确定",
        success: function (res) { }
      });
      return;
    }


    this.convertUser();



    new Jrequest("HotelApi").get("_CreateOrder", this.data.state, data => {



      if (data.BaseResponse.Code == 1) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        // 预付的跳转到对应的支付页面
        if (this.data.RoomPayType == 2) {
          setTimeout(() => {
            this.goPay(data);
          }, 2000)
        } else {

          setTimeout(() => {
            try {

              rto("../successful/index", { "orderid": data.OrderID });
            } catch (error) {
              console.log(JSON.stringify(error));
            }
          }, 2000);

        }
      } else {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
        this.setData({ disabled: false });
      }

    });
  },
  //将入住人的类型转换成订单需要的类型
  convertUser() {

    let users = this.data.userList.reduce((content, item) => {
      content.GuestNames.push(item.GuestNames);
      content.Nationalitys.push(item.Nationalitys);
      return content;
    }, {
        GuestNames: [],
        Nationalitys: []
      });

    let state = this.data.state;

    state.Contact.GuestNames = users.GuestNames.join();
    state.Contact.Nationalitys = users.Nationalitys.join();

    this.setData({
      state: state
    })


  },
  //填写入住人姓名
  bindInputGuestNames(e) {
    let index = e.currentTarget.dataset.key;
    let value = e.detail.value;
    let users = this.data.userList;
    users[index].GuestNames = value;
    this.setData({
      userList: users
    });
    this.convertUser();
  },
  // 填写入住人国籍
  bindInputNationalitys(e) {
    let index = e.currentTarget.dataset.key;
    let value = e.detail.value;
    let users = this.data.userList;
    users[index].Nationalitys = value;
    this.setData({
      userList: users
    });
    this.convertUser();
  },
  //验证担保状态
  valiteGuranteeInfo() {
    let res = this.isGetOrderGuranteeInfo();
    let {view} = this.data;
    view.isGurantee = res;
    // 设置担保状态
    this.setData({
      view
    });
  },
  // 修改最晚离店时间
  bindArrivalTimePickerChange(e) {
    //设置最晚离店日期
    this.setArrivalTime(this.data.ArrivalTimeEnum[+e.detail.value].value, +e.detail.value);
    // 设置担保状态
    this.valiteGuranteeInfo();
  },
  // 设置最晚的离店时间
  setArrivalTime(LatestArrivalTime, ArrivalTimeIndex = 0) {
    this.setData({
      ArrivalTimeIndex,
      state: Object.assign(this.data.state, {
        LatestArrivalTime
      })

    })
  },
  // 清空优惠券
  clearCoupons() {
    this.setData({
      state: Object.assign({}, this.data.state, { HotelOrderCouponsUsedList: [] })
    })
  },
  // 修改房间数的列表
  bindRoomNumberPickerChange(e) {

    this.clearCoupons();
    this.setRoomNum(+e.detail.value + 1);
    // this.isGetOrderGuranteeInfo();
    this.valiteGuranteeInfo();
    this._valiteTotalPrice();

  },
  //写入房间数量
  setRoomNum(RoomNum) {

    // 根据对应的房间数改变对应的入住人
    let users = this.data.userList;
    if (users.length > RoomNum) {
      users = users.slice(0, RoomNum);
    } else if (users.length < RoomNum) {
      let count = RoomNum - users.length, newUsers = [];

      for (let i = 0; i < count; i++) {
        newUsers.push({
          GuestNames: "",
          Nationalitys: "",
        });
      }

      users = users.concat(newUsers)

    }
    // 绑定入住人信息
    this.setData({
      userList: users
    });

    // 绑定房间数量
    this.setData({
      state: Object.assign(this.data.state, {
        RoomNum
      })
    })
  },
  //写入入住日期
  setStartDate(StartDate) {
    let date = new JDate(StartDate);
    this.setData({
      state: Object.assign(this.data.state, {
        ArrivalTime: date.Date2shortStr()
      })
    })

    this.setData({
      StartDate: {
        Month: date.Date2Json().month,
        Day: date.Date2Json().date
      }
    })

    this.setData({
      totalDays: (new JDate(this.data.state.CheckoutTime).getMillisecond() - date.getMillisecond()) / (24 * 60 * 60 * 1000)
    })
  },
  // 写入离店日期
  setEndDate(EndDate) {
    let date = new JDate(EndDate);
    this.setData({
      state: Object.assign(this.data.state, {
        CheckoutTime: date.Date2shortStr()
      })
    })

    this.setData({
      EndDate: {
        Month: date.Date2Json().month,
        Day: date.Date2Json().date
      }
    })

    this.setData({
      totalDays: (date.getMillisecond() - new JDate(this.data.state.ArrivalTime).getMillisecond()) / (24 * 60 * 60 * 1000)
    })

  },
  data: {
    state: {
      RoomNum: 1,
      LatestArrivalTime: createArriveTime()[0].value
    },
    roomEnum: ["1间", "2间", "3间", "4间", "5间", "6间", "7间", "8间", "9间"],
    ArrivalTimeEnum: createArriveTime(),
    ArrivalTimeIndex: 0,
    userList: [{
      GuestNames: "",
      Nationalitys: ""
    }],
    view: {
      CouponCount: 0,
      showGurantee: false,
      show_price_detail: true,
      togglePage: 0,
    },
    couponList: [],
    couponUsed: [],
  },
  onLoad: function (options) {

    new Jrequest("WXBindAPI").get("_Counts", {
      business: 0,
      viewname: "fillorder"
    }, data => {
    })

    /**
     * mock 数据
     */

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000000
    });

    let {
      HotelId,
      HotelCode,
      RoomId,
      RoomTypeId,
      RatePlanID: RatePlanld,
      RatePlanCode,
      StartDate,
      EndDate,
      CityID,
      HotelListId,
      SupplierId,
      PriceType,
      ForPeople,
      TypeCode,
      HotelName,
      Breakfast,
      RoomPayType,
      PriceTypeName,
      RoomName,
    } = options;

    this.setData({
      view: Object.assign({}, this.data.view, { PriceTypeName, RoomName })
    })



    this.setData({
      TypeCode,
      HotelName,
      Breakfast,
      // 判断房间类型
      RoomPayType,
    })

    // 绑定的页面查询数据
    this.setStartDate(StartDate);
    this.setEndDate(EndDate);

    //会员数据暂时没有默认为898
    let CustomerType = 2;
    let RoomNum = 0;

    // 保存创建订单的需要的信息
    this.setData({
      state: Object.assign(this.data.state, {
        CityID,
        ForPeople,
        GuestInformTypeId: 2,
        HotelId,
        Invoice: null,
        IsInvoice: false,
        IsVoucher: false,
        RatePlanCode,
        PriceType,
        RatePlanld,
        Remarks: "",
        RemarksToHotel: "",
        RoomId: +RoomId,
        RoomTypeId,
        RoomTypeName: "",
        SupplierId: +SupplierId,
        ValueDesc: "",
        Contact: {
          IsNationality: TypeCode
        }
      })
    })

    // 保存调用酒店的单个房型多日价格的接口
    this.setData({
      _GetRoomPrice: {
        HotelId,
        HotelCode,
        RoomId,
        RoomTypeId,
        RatePlanld,
        RatePlanCode,
        StartDate,
        EndDate,
        SupplierId,
        CityID,
        CustomerType,
        RoomNum
      }
    })

    // 保存优惠券信息
    this.setData({
      _MoCouponRequest: {
        JSJID,
        CouponOrderType: 2,
        HotelInfo: {
          HotelId,
          HotelCode,                                    //酒店Code (必填)
          RoomId,                                          //房型ID (必填)
          RoomTypeId,                                      //销售房型ID (必填)
          RatePlanld,                           //价格计划ID (必填)
          RatePlanCode,                                    //价格计划Code (必填)
          StartDate,                                    //开始日期 格式2015-08-10 (必填)
          EndDate,                                        //结束日期 格式2015-08-10 (必填)
          SupplierId,                                      //酒店归属 (必填)
          CityID,                                          //城市ID (必填)
        },
        CouponEnableUse: 1,
      }
    });

    // 保存酒店担保信息接口
    this.setData({
      MoOrderGuranteeInfoRequest: {
        RoomID: RoomId,
        RatePlanid: RatePlanld,
        RoomTypeID: RoomTypeId,
        HotelID: HotelId,
        CityID,
      }
    });

    isLogin();



    this.pageInit();

    // 生命周期函数--监听页面加载

  },
  // 获取会员信息
  _GetUserInfoByJSJID(cb) {
    //获取会员信息
    new Jrequest("JUser").get("GetUserInfoByJSJID", {
      JSJID: JSJID,
    }, data => {

      if (data.BaseResponse.IsSuccess) {

        // 查询默认的手机
        let arr = data.ContactmeansList.filter(item => item.ContactMeansTypeID == 1);
        let ContactMeansNum = arr.length ? arr[0].ContactMeansNum : "";
        // 查询默认联系人姓名
        let ContactName = data.CustMng.CustomerName || "";

        // 保存创建订单的需要的信息
        this.setData({
          state: Object.assign(this.data.state, {
            CardTypeId: data.CardList.length ? data.CardList[0].CardTypeID : "",
            Contact: {
              ContactName: ContactName,
              ContactMobile: ContactMeansNum
            },
            CustomerCardId: data.CardList.length ? data.CardList[0].CardID : "",
            CustomerId: data.CustMng.CustomerID,
            CustomerName: ContactName,
          })
        })
      }

      cb(data);

    });
  },
  // 获取代金券信息
  GetCoupon(num = 1) {

    let MoCouponRequest = this.data._MoCouponRequest;
    MoCouponRequest.HotelInfo.RoomNum = num;
    MoCouponRequest.JSJID = JSJID;


    new Jrequest("User").get("GetCoupon", MoCouponRequest, data => {

      if (data.BaseResponse.IsSuccess == 1) {

        if (data.list) {


          this.setData({
            view: Object.assign({}, this.data.view, { CouponCount: data.list.length || 0, countleo: "123" })
          });

          data.list.map(item => item.index).forEach((item, index) => {

            data.list[index].selected = true;
          })

          this.setData({
            couponList: data || []
          })

          try {
            wx.setStorageSync('GetCoupon', data.list);
          } catch (e) { }

        } else {
        }

      } else {

      }


    });

  },
  // 请求担保信息
  _GetOrderGuranteeInfo() {
    //调用酒店担保信息
    new Jrequest("HotelApi").get("_GetOrderGuranteeInfo", this.data.MoOrderGuranteeInfoRequest, data => {
      wx.hideToast()
      if (data.BaseResponse.Code == 1) {
        this.setData(Object.assign(this.data, {
          GuranteeInfo: data
        }));
        /**
         * 判断是否担保酒店
         */

        this.valiteGuranteeInfo();

      }
    });
  },
  // 请求每日价格
  _GetRoomPrice() {

    // 调用单个房型多日价格
    new Jrequest("HotelApi").get("_GetRoomPrice", this.data._GetRoomPrice, data => {

      if (data.BaseResponse.Code == 1) {
        let state = this.data.state;
        // state.PriceType = data.ListRoomPrice[0].CurrencyID;
        this.setData({
          state
        })
        this.setData(Object.assign(this.data, {
          RoomPrice: data
        }));

        // 获取担保信息
        this._GetOrderGuranteeInfo();

        this._valiteTotalPrice();
      }

    });
  },
  _viewGuranteeInfo() {

    let PriceTotal = this._getRoomTotalPrice();

    if (this.data.GuranteeInfo.NSType == 1) {
      // 定额担保
      return this.data.GuranteeInfo.NSMoney || 0;
    } else if (this.data.GuranteeInfo.NSType == 3) {
      // 全额担保 
      return PriceTotal;
    } else if (this.data.GuranteeInfo.NSType == 2) {
      // 首晚担保
      return this.data.RoomPrice.ListRoomPrice[0].MemberPrice * this.data.state.RoomNum;
    }
  },
  // 获取房费总价格
  _getRoomTotalPrice() {
    if (!this.data.RoomPrice) return 0;
    let {RoomNum} = this.data.state;
    let ListRoomPrice = this.data.RoomPrice.ListRoomPrice || [];
    let PriceTotal = ListRoomPrice.reduce((content, item) => {
      content += item.MemberPrice * RoomNum;
      return content;
    }, 0);
    return PriceTotal;
  },
  // 获取代金券总价格
  _getCouponsPrice() {
    return (this.data.state.HotelOrderCouponsUsedList || []).reduce((content, item) => {
      content += item.CouponsPrice;
      return content;
    }, 0);
  },
  //计算总价
  _valiteTotalPrice() {
    /**
         * 计算总体的价格
         */

    let RoomTotalPrice = this._getRoomTotalPrice();

    // 预付订单代金券
    let couponsPrice = this._getCouponsPrice() || 0;

    let PriceTotal = RoomTotalPrice - couponsPrice;
    this.setData({
      state: Object.assign(this.data.state, {
        PriceTotal
      }),
      view: Object.assign({}, this.data.view, {
        PriceTotal: PriceTotal.toFixed(2),
        RoomTotalPrice,
        couponsPrice,
      })
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 100000
    });



    isLogin();

    this.pageInit();
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