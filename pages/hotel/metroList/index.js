const {to, rto} = require("../../../utils/navigate.js");
const Jrequest = require("../../../api/request.js");


let app = getApp();


Page({
  bindClick(e) {
    let url = "pages/hotel/index/index";
    let json = e.target.dataset.json || e.currentTarget.dataset.json;
    json = JSON.parse(json);


    let data = app.globalData.bak.get(url);
    data.keyWorldName = json.name;
    delete json.name;
    data.state = Object.assign(data.state, { "LocationType": 0, "BaiDuLon": "0", "BaiDuLat": "0", "name": "", "HotelCompanyId": "" }, json);

    app.globalData.bak.set(url, data);

    wx.navigateBack({ delta: 2 });

  },
  selectUl(e) {

    let index = e.currentTarget.dataset.index;
    let ListSubway = this.data.ListSubway;
    ListSubway[index].selected = true;
    this.setData({
      ListSubway,
      indexCur: index
    })
  },
  data: {
    indexCur: 0
  },
  onLoad: function (options) {
    new Jrequest("HotelApi").get("_GetHotelConditionByCityId", { CityID: 110000 }, res => {

      res.ListSubway[0].selected = true;
      this.setData({

        ListSubway: res.ListSubway.map(item => {

          item.ListSubwayStationItem = item.ListSubwayStationItem.map(item => {
         
            return {
              LocationType: 1,
              BaiDuLon: item.BaiDuLon,
              BaiDuLat: item.BaiDuLat,
              name: item.MetroStationName,
              HotelCompanyId: "",
              data: JSON.stringify({
                LocationType: 1,
                BaiDuLon: item.BaiDuLon,
                BaiDuLat: item.BaiDuLat,
                name: item.MetroStationName,
                HotelCompanyId: "",
              })
            }

          })

          return item;

        }) || []
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