// pages/viphall/index.js
let Jrequest = require("../../../api/request.js");
let JDate = require("../../../utils/JDate.js");
let {to} = require("../../../utils/navigate.js");


    
Page({
	
	//拨打电话
	calling:function(){
    wx.makePhoneCall({
   
      phoneNumber: this.data.VipHallInfo.CustomerServiceTel,
      success:function(){
    
      },
      fail:function(){
   
      }
    })
  },
  
  //设置贵宾厅详情头部的贵宾厅名称
  settitle:function(obj){
    wx.setNavigationBarTitle({
		  title: obj
		})
  },
  
  //页面加载
	onLoad:function(options){
    new Jrequest("WXBindAPI").get("_Counts",{
       business:3,
       viewname:"viphalllist"
      },data=>{
     })
     wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 100000
    });

	  let EncrptParam  = options.id;
    let _arrayRes ={
    		EncrptParam
    	}
    new Jrequest("VipHallApi").get("_GetVIPHallDetail",_arrayRes, data => { 
    
    if(data.BaseResponse.IsSuccess){
          data.Remark=data.Remark.replace("设计主题：","");
  
         this.setData({
          VipHallInfo:data,
          VipHallInfoBanner:data.IndoorAttachmentList,
          VipHallInfoImg:data.VIPHallAuxTypeList,
          VIPHallImagesDesc:data.VIPHallImagesDesc,
        }),
				//贵宾厅名称赋值到导航栏	
				this.settitle(data.AirportName);
	    }
	  });
  },
  onReady:function(){
     wx.hideToast();
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