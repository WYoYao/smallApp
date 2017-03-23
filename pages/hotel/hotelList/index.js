// 引入调用接口类
let Jrequest = require("../../../api/request.js");
let JDate = require("../../../utils/JDate.js");
let {to} = require("../../../utils/navigate.js");
let {swichStartType, switchPriceType} = require("../common/hotelConvert.js");



Page({
  //设置排序
  setSort(e){
    
    let OrderType=e.currentTarget.dataset.sort;
    this.setData({
      state:Object.assign({},this.data.state,{
        OrderType
      }),
      SortActive:OrderType
    });
    this.getHotelList();
    this.hideSort();
  },
  showSort(e){
    this.setData({
      SortState:false
    })
  },
  hideSort(e){
    this.setData({
      SortState:true
    })
  },
  // 加载更多的酒店
  getMoreHotel(e) {
    wx.showToast({
      title: '加载中',
       mask:true,
      icon: 'loading',
      duration: 100000
    })

    this.setData({
      state: Object.assign({OrderType:6}, this.data.state, {
        PageIndex: ++this.data.state.PageIndex
      })
    })

    new Jrequest("HotelApi").get("_GetHotelList", this.data.state, data => {
      wx.hideToast();
      if (data.BaseResponse.Code == 1) {
        // 获取的数据转换出页面需要的属性
        if (data.ListHotel) {

          let ListHotel = data.ListHotel.map(item => {

            item.HotelStarType = swichStartType(item.HotelStarId);
            item.PriceType = switchPriceType(item.CurrencyId);
            item.string = JSON.stringify(item);
            return item;
          });
          if (ListHotel) {
            this.setData({
              hotelListRes: {
                ListHotel: this.data.hotelListRes.ListHotel.concat(ListHotel),
                TotalCount: data.TotalCount
              }
            })
          }
        }

      }


    })

  },
  setPageIndex(index = 1) {
    this.setData({
      state: Object.assign({}, this.data.state, { PageIndex: 1 })
    })
  },
  //绑定首页时间
  bindStartDateChange(e) {
    // 如果入住日期大于离店日期 同时修改离店日期
    if (new JDate(e.detail.value) >= new JDate(this.data.state.EndDate)) {
      this.setEndDate(new JDate(e.detail.value).addDate(1).Date2shortStr());
    }
    this.setStartDate(e.detail.value);
  },
  //绑定首页时间
  bindEndDateChange(e) {
    if (new JDate(e.detail.value) <= new JDate(this.data.state.StartDate)) {
      this.setStartDate(new JDate(e.detail.value).addDate(-1).Date2shortStr());
    }
    this.setEndDate(e.detail.value);
  },
  // 跳转到对应的关键字页面
  toKeyWord: function (e) {
    
    to("../keyword/index", {}, { bak: true, data: this.data });
  },
  handleToDetail: function (e) {
    
    to("../hoteldetails/index", Object.assign(JSON.parse(e.currentTarget.dataset.item), this.data.state));
  },
  // 设置入住日期
  setStartDate(StartDate) {
    this.setData({
      state: Object.assign(this.data.state, {
        StartDate
      })
    })
    let date = new JDate(StartDate).Date2Json();
    this.setData({
      StartDate: {
        Month: date.month,
        Day: date.date
      }
    })
    this.setPageIndex();
    this.getHotelList();
  },
  // 设置离店日期
  setEndDate(EndDate) {
    this.setData({
      state: Object.assign(this.data.state, {
        EndDate
      })
    })
    let date = new JDate(EndDate).Date2Json();
    this.setData({
      EndtDate: {
        Month: date.month,
        Day: date.date
      }
    })
    this.setPageIndex();
    this.getHotelList();
  },
  // 获取酒店列表
  getHotelList: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask:true,
      duration: 100000
    })
    new Jrequest("HotelApi").get("_GetHotelList", Object.assign({OrderType:6},this.data.state), data => {
      wx.hideToast();
      if (data.BaseResponse.Code == 1) {

        // 获取的数据转换出页面需要的属性
        let ListHotel = data.ListHotel.map(item => {

          item.HotelStarType = swichStartType(item.HotelStarId);
          item.PriceType = switchPriceType(item.CurrencyId);
          item.string = JSON.stringify(item);
          return item;
        });

        this.setData({
          hotelListRes: {
            ListHotel,
            TotalCount: data.TotalCount
          }
        })

      }

    });
  },
  data: {
    SortState:true,
    SortActive:6
  },
  onLoad: function (options) {
    new Jrequest("WXBindAPI").get("_Counts",{
       business:0,
       viewname:"hotellist"
      },data=>{
     })

    wx.showToast({
      title: '加载中',
       mask:true,
      icon: 'loading',
      duration: 100000
    })

    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        if (options[key] === "" || options[key] === null) {
          delete options[key];
        }
      }
    }
    // 接收上一页面的参数  附加到当前页面对象上面
    let {StartDate, EndDate} = options;
    this.setData({
      state: Object.assign(options, this.data.state, { PageIndex: 1, PageSize: 20 }),
      StartSelectStartDate: new JDate().Date2shortStr(),
      StartSelectEndDate: new JDate().addMonth(5).addDate(-1).Date2shortStr(),
      EndSelectStartDate: new JDate().addDate(1).Date2shortStr(),
      EndSelectEndDate: new JDate().addMonth(5).Date2shortStr()
    });
    this.setStartDate(StartDate);
    this.setEndDate(EndDate);
    // 生命周期函数--监听页面加载

    let req = {
      BaseRequest: {
        AppSource: 2,
        ClientLanguage: 0,
        SourceWay: 20,
        FunctionVersion: 2
      },
    };

    this.getHotelList();
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    this.setPageIndex();
    let options = this.data.state;

    if(options.data){
      try {

        let json=JSON.parse(options.data);
        let {name:addressName}=json;
        this.setData({addressName});

      } catch (error) {
        
      }
    }


    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        if (options[key] === "" || options[key] === null) {
          delete options[key];
        }
      }
    }

    this.setData({
      state: options
    })

    this.setData({
      hotelListRes:[],
      TotalCount:0,
    })

    this.getHotelList();
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