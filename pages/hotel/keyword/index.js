const {to, rto} = require("../../../utils/navigate.js");
const Jrequest = require("../../../api/request.js");
const {
  ListStationAirport2Item,
  ListHotelCircle2Item,
  ListHotelGroup2Item,
  ListCounty2Item
} = require("../common/hotelConvert.js");

let app = getApp();
const log_name="SearchLog";

Page({
  delete(){
    wx.removeStorageSync(log_name)
    this.getSearchLog();
  },
  bindSearchfocus(e) {

    this.setData({
      show_search: true
    })
  },
  // bindSearchClick(e) {
  //   let routers = getCurrentPages();
  //   let url = routers[routers.length - 2].__route__;
  //   // let url = "pages/hotel/index/index";
  //   let json = e.target.dataset.json || e.currentTarget.dataset.json;
  //   json = JSON.parse(json);

  //   this.setClickLog(json);

  //   let data = app.globalData.bak.get(url);
  //   data.keyWorldName = json.name;
  //   if (!json.LocationType) {
  //     json.KeyWord = json.name;
  //   }
  //   delete json.name;
  //   data.state = Object.assign(data.state, { "LocationType": 0, "LocationId": "", "BaiDuLon": "0", "BaiDuLat": "0", "HotelCompanyId": "" }, json);
  //   app.globalData.bak.set(url, data);
  //   wx.navigateBack({ delta: 1 });

  // },
  bindhandleinput(e) {
    let key = e.detail.value;

    if (key) {
      new Jrequest("HotelApi").get("_GetSearchKeyWordByCityId", { CityID: 110000, KeyWord: e.detail.value }, data => {

        // 将查询出来的信息转换除阿里展示到查询页面上面
        let arr = data.ListSubwayStationGroup.reduce((content, item) => {

          switch (item.SubWayID) {
            case 4:
              return content.concat(item.ListSubWayStation.map(item => {
                return {
                  LocationType: 4,
                  LocationId: item.ID,
                  name: item.Name,
                  keyWorldName: "商圈",
                  HotelCompanyId: "",
                  data: JSON.stringify({
                    LocationType: 4,
                    LocationId: item.ID,
                    BaiDuLon: "",
                    BaiDuLat: "",
                    name: item.Name,
                    HotelCompanyId: "",
                  })
                }
              }));
              break;
            case 5:
              return content.concat(item.ListSubWayStation.map(item => {
                return {
                  LocationType: 5,
                  LocationId: "",
                  BaiDuLon: item.BaiDuLon,
                  BaiDuLat: item.BaiDuLat,
                  keyWorldName: "景点",
                  name: item.Name,
                  HotelCompanyId: "",
                  data: JSON.stringify({
                    LocationType: 5,
                    LocationId: "",
                    BaiDuLon: item.BaiDuLon,
                    BaiDuLat: item.BaiDuLat,
                    name: item.Name,
                    HotelCompanyId: "",
                  })
                }
              }));
              break;
            case 6:
              return content.concat(item.ListSubWayStation.map(item => {
                return {
                  LocationType: "",
                  LocationId: "",
                  BaiDuLon: "",
                  BaiDuLat: "",
                  name: item.Name,
                  keyWorldName: "酒店",
                  HotelCompanyId: "",
                  data: JSON.stringify({
                    LocationType: "",
                    LocationId: "",
                    BaiDuLon: "",
                    BaiDuLat: "",
                    name: item.Name,
                    HotelCompanyId: "",
                  })
                }
              }));
              break;
            default:
              return content;
              break;
          }


        }, []);

        this.setData({
          searchList: arr
        })

      }, { isCache: true });
    } else {
      this.setData({
        searchList: [],
        show_search: false
      })
    }

  },
  bindGoDetail(e) {
    let key = e.currentTarget.dataset.key;
    if (key == "ListSubway") {
      to("../metroList/index", {});
    } else {
      to("../spotList/index", { key });
    }
  },
  bindClick(e) {
    let routers = getCurrentPages();
    let url = routers[routers.length - 2].__route__;

    // let url = "pages/hotel/index/index";
    let json = e.target.dataset.json || e.currentTarget.dataset.json;
    if(!json)return;
    json = JSON.parse(json);

    this.setClickLog(json);

    let data = app.globalData.bak.get(url);
    data.keyWorldName = json.name;
     if (!json.LocationType) {
      json.KeyWord = json.name;
    }
    delete json.name;
    data.state = Object.assign(data.state, { "LocationType": 0, "LocationId": "", "BaiDuLon": "0", "BaiDuLat": "0", "HotelCompanyId": "" }, json);

    app.globalData.bak.set(url, data);
    wx.navigateBack({ delta: 1 });

  },
  // 添加选择记录
  setClickLog(Obj={}) {

    try {
      let res = wx.getStorageSync(log_name) || [];

      res = res.filter(item=>item.name!=Obj.name);

      if (res.length == 8) {
        res.shift();
      }

      res.push(Obj);

      res=res.map(item=>{
        item.data=JSON.stringify(item);
        return item;
      })

      wx.setStorageSync(log_name, res);

    } catch (error) {

    }

  },
  getSearchLog(){
    wx.getStorage({
      key: log_name,
      success: (res)=> {
   
        res = res.data || [];
  
        if(!res.length){
          this.setData({
            hiddenLog:true
          })
        }else{

          while(res.length<8){
             res.unshift({});
          }

          this.setData({
            SearchLog:res.reverse()
          })

        }
      },
      fail:()=>{
        this.setData({
            hiddenLog:true
          })
      }
    })
  },
  data: {
    show_search: false
  },
  onLoad: function (options) {

     wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask:true,
      duration: 100000
    });

    this.getSearchLog();

    new Jrequest("HotelApi").get("_GetHotelConditionByCityId", { CityID: 110000 }, data => {
      wx.hideToast();
      //机场 车站
      let ListStationAirport = ListStationAirport2Item(data.ListStationAirport);
      for (let i = 0; i < (8 - ListStationAirport.length); i++) {
        ListStationAirport.push({});
      }

      //商圈
      let ListHotelCircle = ListHotelCircle2Item(data.ListHotelCircle);
      for (let i = 0; i < (8 - ListHotelCircle.length); i++) {
        ListHotelCircle.push({});
      }

      //地铁
      let ListSubway = data.ListSubway.reduce((content, item) => {

        return content.concat(item.ListSubwayStationItem)
      }, []).map(item => {
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

      });
      for (let i = 0; i < (8 - ListSubway.length); i++) {
        ListSubway.push({});
      }

      //品牌连锁
      let ListHotelGroup = ListHotelGroup2Item(data.ListHotelGroup);

      for (let i = 0; i < (8 - ListHotelGroup.length); i++) {
        ListHotelGroup.push({});
      }

      //行政区域
      let ListCounty = ListCounty2Item(data.ListCounty);

      for (let i = 0; i < (8 - ListCounty.length); i++) {
        ListCounty.push({});
      }

      this.setData({
        ListStationAirport,
        ListHotelCircle,
        ListSubway,
        ListHotelGroup,
        ListCounty
      });

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