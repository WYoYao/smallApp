//index.js
//获取应用实例
const {rto, to} = require("../../../utils/navigate.js");
// let navigate=require("../../../utils/navigate.js");
const Jrequest = require("../../../api/request.js");
const JDate = require("../../../utils/JDate.js");
// 获取当前页面信息
const {getIndexPage} = require("../../../utils/pageInfo.js");


let app = getApp();
// 调用酒店列表
// let req={
//     BaseRequest: {
//         AppSource: 2,
//         ClientLanguage: 0,
//         SourceWay: 20,
//         FunctionVersion: 2
//     },
//     "CityId": 110000, 
//     "StartDate": "2017-01-12", 
//     "EndDate": "2017-01-13"
// };

Page({
  goHotelList(){
    to("../../member/order/hotel/list/index");
  },
  goVIPHall(){
    to("../../viphall/index/index");
  },
  goIndex(){
    rto("../../index");
  },
  // 清理查询条件
  clearSearch(e){

    let state=this.data.state;
    ["LocationType","LocationId","BaiDuLon","BaiDuLat","HotelCompanyId","KeyWord"].forEach(item=>{
      delete state[item];
    });

    this.setData({
      state,
      keyWorldName:false,
    });
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
  data: {
    // state:{
    //   StartDate: JDate().Date2shortStr(),
    //   EndDate:JDate().addDate(1).Date2shortStr(),
    //   CityId:"110000",
    //   KeyWord:"自签测试酒店",
    //   PriceMin:0,
    //   PriceMax:999999,
    //   HotelStarId:-1,
    //   OrderType:6
    // },
    // StartDate:{
    //   Month:JDate().Date2Json().month,
    //   Day:JDate().Date2Json().date
    // },
    // EndtDate:{
    //   Month:JDate().addDate(1).Date2Json().month,
    //   Day:JDate().addDate(1).Date2Json().date,
    // }
  },
  setStartDate(StartDate) {
    this.setData({
      state: Object.assign(this.data.state || {}, {
        StartDate
      })
    })
    let date = new JDate(StartDate);



    this.setData({
      StartDate: {
        Month: date.Date2Json().month,
        Day: date.Date2Json().date,
        forNow: date.forNow(),
      },
      totaldays: (new JDate(this.data.state.EndDate) - new JDate(this.data.state.StartDate)) / (24 * 60 * 60 * 1000)
    })
  },
  setEndDate(EndDate) {
    this.setData({
      state: Object.assign(this.data.state || {}, {
        EndDate
      })
    })
    let date = new JDate(EndDate);
    this.setData({
      EndtDate: {
        Month: date.Date2Json().month,
        Day: date.Date2Json().date,
        forNow: date.forNow()
      },
      totaldays: (new JDate(this.data.state.EndDate) - new JDate(this.data.state.StartDate)) / (24 * 60 * 60 * 1000)
    })
  },
  handle_submit: function (event) {
    to("../hotelList/index", this.data.state);
  },
  // 跳转城市列表
  handle_keyword_list: function (event) {
    let {LocationType=0,LocationId=0,BaiDuLon=0,BaiDuLat=0,HotelCompanyId=""} = this.data.state;
    let { keyWorldName }=this.data;
    to("../keyword/index", { keyWorldName }, { bak: true, data: this.data });
  },
  // 跳转关键字列表
  handle_city_list:function(event){
    to("../citylist/index", { CityId:this.data.state.CityId }, { bak: true, data: this.data });
  },
  onLoad: function (options) {

    /**
     * 
     * 统计代码
     */
     new Jrequest("WXBindAPI").get("_Counts",{
       business:0,
       viewname:"hotelindex"
      },data=>{

       console.log(data);
     })



    /** */


    // 绑定默认的日期
    if (!this.data.state) {
      this.setStartDate(JDate().Date2shortStr());
      this.setEndDate(JDate().addDate(1).Date2shortStr());
      // 默认开始入住日期和的离店日期的限制
      this.setData({
        state:Object.assign(this.data.state,{CityId:110000}),
        CityName:"北京",
        StartSelectStartDate: new JDate().Date2shortStr(),
        StartSelectEndDate: new JDate().addMonth(5).addDate(-1).Date2shortStr(),
        EndSelectStartDate: new JDate().addDate(1).Date2shortStr(),
        EndSelectEndDate: new JDate().addMonth(5).Date2shortStr()
      })
    };


    this.setData({
      CityName:this.data.CityName
    })

    // this.setData(Object.assign({},this.data));

    // Do some initialize when page load.
  },
  onReady: function () {
  
    // Do something when page ready.
  },
  onShow: function () {
   
    // wx.setNavigationBarTitle("asd");
    // Do something when page show.
  },
  onHide: function () {

    // Do something when page hide.
  },
  onUnload: function () {
    
    // Do something when page close.
  },
  onPullDownRefresh: function () {
  
    // Do something when pull down.
  },
  onReachBottom: function () {
 
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
  
    // return custom share data when user share.
  },
  // Event handler.
  viewTap: function () {
    this.setData({
      text: 'Set some data for updating view.'
    })
  },
  customData: {
    hi: 'MINA'
  }
})
