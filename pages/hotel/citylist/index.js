const {to, rto} = require("../../../utils/navigate.js");
const Jrequest = require("../../../api/request.js");
const JDate = require("../../../utils/JDate.js");
const conf = require("../../../api/conf.js");


const app = getApp();

Page({
  //取消按钮事件
  bindCancel(e) {
    this.setData({
      resultList: [],
      nohasSearch: true,
      hiddenSearch: true,
      SearchKey: ""
    })
  },
  //用户输入搜索
  bindInput(e) {

    let str = e.detail.value || "";
    let resultList = [];
    let timer;
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      if (str.length > 0) {
        resultList = this.data.cityList.reduce((content, item, index) => {
          if (index != 0) {
            content = content.concat(
              item.ListMobileCity.filter(info => {
                return info.CityName.indexOf(str) != -1 || info.CityJianPin.indexOf(str) != -1 || info.CityPinYin.indexOf(str) != -1;
              })
            )
          }

          return content;
        }, []);
      }




      // 绑定查询出来的数据 同时判断显示或隐藏对应的暂无数据
      this.setData({
        resultList,
        nohasSearch: resultList.length ? true : false
      })
    }, 500);


  },
  //用户触发获取焦点事件，然后
  bindFocus(e) {

    this.setData({
      hiddenSearch: false,
      SearchFocus: true
    });
  },
  bindTouch(e) {
    this.setData({
      pageIndex: e.currentTarget.dataset.id
    })
  },
  // 选中事件
  bindSelected(e) {
    let url = "pages/hotel/index/index";
    let CityId = e.target.dataset.cityid || e.currentTarget.dataset.cityid;
    let CityName = this.data.cityList.reduce((content, item, index) => {
      if (index == 0) return content;
      let list = item.ListMobileCity.filter(item => item.CityID == CityId);
      return list.length ? list[0].CityName : content;
    }, "");

    let data = app.globalData.bak.get(url);
    data.state = Object.assign(data.state, { CityId });
    data.CityName = CityName;

    // if(options.CityId && options.CityName){
    //   this.setData({
    //     state:Object.assign(this.data.state,{CityId:options.CityId}),
    //     CityName:options.CityName
    //   })
    // }
    wx.navigateBack({ delta: 1 });
    // rto("../index/index", { CityId,CityName });
  },
  data: {
    hiddenSearch: true,
    nohasSearch: true,
  },
  onLoad: function (options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 100000
    });

    new Jrequest("HotelApi").get("_GetMobileCityList", Object.assign({}, conf.HotelApi.BaseRequest), data => {
      wx.hideToast();
      if (data.BaseResponse.Code == 1) {
        //保存城市信息到本地仓库中
        // wx.setStorage({
        //   key:"hotel_GetMobileCityList",
        //   data:data.CityData
        // })

        // 页面写入住值
        this.setData({
          cityList: data.CityData
        });

        this.setData({
          CityId: options.CityId
        });


        // let citylists = data.CityData.reduce((content,item)=>{
        //   if(item.GroupName!="常用城市"){
        //     content=content.concat(item.ListMobileCity);
        //   }
        //   return content;
        // },[]);


      }

    });

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