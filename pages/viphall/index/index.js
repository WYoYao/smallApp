// pages/viphall/index.js
let Jrequest = require("../../../api/request.js");
let JDate = require("../../../utils/JDate.js");
let {to} = require("../../../utils/navigate.js");


var app = getApp();

Page({
	
	data:{},

	handleToDetail: function (e) {
  	to("../detail/index",{id:e.currentTarget.dataset.item});
  },
	
	
 // 获取酒店列表
  getVIPHallList:function(){

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 100000
    });

  	let PartnerLoginName     = "100001";
    let	PartnerLoginPassword = "315eb115d98fcbad39ffc5edebd669c9";
    let PageIndex            = 0;
    let PageSize             = 100;

  	let _arrayRes ={
  			PartnerLoginName,	
	      PartnerLoginPassword,	
	      PageIndex,
	      PageSize
	  };

   	new Jrequest("VipHallApi").get("_GetVIPHallList", _arrayRes, data => { 

      if(data.BaseResponse.IsSuccess){
			  // 获取的数据转换出页面需要的属性
        let GroupedVIPHallList = data.GroupedVIPHallList;

        this.setData({
           GroupedVIPHallListRes:{
            GroupedVIPHallList,
            TotalCount:data.TotalCount
          }
        });

        wx.hideToast();
      }
     });
  },
  
  onLoad:function(options){
    new Jrequest("WXBindAPI").get("_Counts",{
       business:3,
       viewname:"viphallindex"
      },data=>{
     })
    // 页面初始化 options为页面跳转所带来的参数
    this.getVIPHallList();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})