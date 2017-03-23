const {to, rto} = require("../../../utils/navigate.js");
const Jrequest = require("../../../api/request.js");


let app = getApp();

const {
  ListStationAirport2Item,
  ListHotelCircle2Item,
  ListHotelGroup2Item,
  ListCounty2Item
} = require("../common/hotelConvert.js");

Page({
  
  bindClick(e){
      let routers = getCurrentPages();
      let url = routers[routers.length - 2].__route__;
      if(["pages/hotel/index/index","pages/hotel/hotelList/index"].indexOf(url)==-1){
        url=routers[routers.length - 3].__route__;
      }
      let json=e.target.dataset.json || e.currentTarget.dataset.json;
      json=JSON.parse(json);


      let data=app.globalData.bak.get(url);
      data.keyWorldName=json.name;
      delete json.name;
      data.state=Object.assign(data.state,{"LocationType":0,"BaiDuLon":"0","BaiDuLat":"0","name":"","HotelCompanyId":""},json);

      app.globalData.bak.set(url,data);
      
      wx.navigateBack({delta:2});

  },
  data: {

  },
  onLoad: function (options) {
    let {key} = options;

    new Jrequest("HotelApi").get("_GetHotelConditionByCityId", { CityID: 110000 }, res => {

      let listdatas;
      if(key=="ListStationAirport"){
        listdatas=ListStationAirport2Item(res[key]);
      }else if(key=="ListHotelCircle"){
        listdatas=ListHotelCircle2Item(res[key]);
      }else if(key=="ListHotelGroup"){
        listdatas=ListHotelGroup2Item(res[key]);
      }else if(key=="ListCounty"){
        listdatas=ListCounty2Item(res[key]);
      }

      this.setData({
        listdatas
      })

    }, { isCache: true });
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