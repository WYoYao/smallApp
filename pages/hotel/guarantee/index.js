// 引入调用接口类
const Jrequest = require("../../../api/request.js");

const {rto,to} = require("../../../utils/navigate.js");
// 页面需要的转换类型
const {swichStartType, switchPriceType, switchBreakfastNum, swichWIFI} = require("../common/hotelConvert.js");

const JDate = require("../../../utils/JDate.js");

const {isLogin} = require("../../../utils/CheckLogin.js");


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
    // 验证行用卡信息
    valiteCreditCard() {
        let CreditCard = this.data.state.CreditCard || {};

        let enumTitle = {
            CreditType: "请选择行用卡所在银行",
            CreditNumber: "请填写正确的行用卡号",
            CVV: "请填写正确的CVV码",
            ExpirationYear: "请填写正确的行用卡有效期年",
            ExpirationMonth: "请填写正确的行用卡有效期月",
            HolderName: "请填写持卡人",
            CreditCardMobile: "请填写正确银行预留手机号"
        };

        // 循环遍历的所有的键值
        // for(let key of Object.keys(enumTitle)){

        //     if(enumTitle.hasOwnProperty(key)){
        //         if(!CreditCard[key]){
        //              wx.showModal({
        //                 title: '提示',
        //                 content: enumTitle[key],
        //                 showCancel:false,
        //                 confirmText:"确定",
        //                 success: function(res) {

        //                 }
        //             });
        //             return false;
        //         }

        //     }
        // }

        //验证全部非空


        // 判断行用卡类型
        if (!CreditCard.CreditType) {
            wx.showModal({
                title: '提示',
                content: enumTitle.CreditType,
                showCancel: false,
                confirmText: "确定",
                success: function (res) {
                    if (res.confirm) {

                    }
                }
            });
            return false;
        }


        if (!(CreditCard.CreditNumber && /^[0-9]{16}$/.test(CreditCard.CreditNumber))) {
            wx.showModal({
                title: '提示',
                content: enumTitle.CreditNumber,
                showCancel: false,
                confirmText: "确定",
                success: function (res) {

                }
            });
            return false;
        }

        if (!(CreditCard.HolderName && !/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(CreditCard.HolderName))) {
            wx.showModal({
                title: '提示',
                content: !CreditCard.HolderName ? enumTitle.HolderName : "持卡人姓名中不能包含特殊字符",
                showCancel: false,
                confirmText: "确定",
                success: function (res) { }
            });
            return false;
        }

        if (!/^[0-9]{3}$/.test(CreditCard.CVV || "")) {
            wx.showModal({
                title: '提示',
                content: enumTitle.CVV,
                showCancel: false,
                confirmText: "确定",
                success: function (res) { }
            });
            return false;
        }

        if (!/^[0-9]{4}$/.test(CreditCard.ExpirationYear || "")) {
            wx.showModal({
                title: '提示',
                content: enumTitle.ExpirationYear,
                showCancel: false,
                confirmText: "确定",
                success: function (res) { }
            });
            return false;
        }

        if (!/^[0-9]{1,2}$/.test(CreditCard.ExpirationMonth || "")) {
            wx.showModal({
                title: '提示',
                content: enumTitle.ExpirationMonth,
                showCancel: false,
                confirmText: "确定",
                success: function (res) { }
            });
            return false;
        }

        // 验证身份证
        if (CreditCard.IdType == 0) {
            //身份证
            if (!/(^\d{15}$)|(^\d{17}([0-9]|[x])$)/.test(CreditCard.IdNo.toLowerCase() || "")) {
                wx.showModal({
                    title: '提示',
                    content: "请输入正确的证件号码",
                    showCancel: false,
                    confirmText: "确定",
                    success: function (res) { }
                });
                return false;
            }


        } else if (CreditCard.IdType == 1) {
            //护照
            if (!/^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/.test(CreditCard.IdNo || "")) {
                wx.showModal({
                    title: '提示',
                    content: "请输入正确的证件号码",
                    showCancel: false,
                    confirmText: "确定",
                    success: function (res) { }
                });
                return false;
            }

        }

        return true;

    },
    bingCommitOrder() {
        if(this.data.disabled){
            return;
        }
 
        if (!this.valiteCreditCard()) {
            return;
        }

        let {state} = this.data;

        state.CreditCard.GuaranteeType = 0;
        state.CreditCard.IsCVV = true;
        state.IsGuarantee=true;

        this.setData({disabled:true});

        new Jrequest("HotelApi").get("_CreateOrder", this.data.state, data => {
           

            if (data.BaseResponse.Code == 1) {
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                })

                setTimeout(() => {
                    rto("../successful/index", { "orderid": data.OrderID });
                }, 2000)
            } else {
                wx.showToast({
                    title: '失败',
                    icon: 'success',
                    duration: 2000
                })
                 this.setData({disabled:false});
            }


        });
    },
    selectIdType(e) {
        let IdType = e.currentTarget.dataset.idtype;

        this.setData({
            show_cardtype: false,
            state: Object.assign({}, this.data.state, { CreditCard: Object.assign({}, this.data.state.CreditCard, { IdType, IdNo: "" }) })
        })
    },
    show_cardtype() {
        this.setData({
            show_cardtype: true
        })
    },
    // 绑定移除的时间
    BindEventBlurhandle(e) {
        let key = e.currentTarget.dataset.type;
        let value;
        if(key=="ExpirationYear"){
            value="20"+e.detail.value;
        }else{
            value = e.detail.value;
        }
        
        let {state} = this.data;
        state.CreditCard = state.CreditCard || {};
        state.CreditCard[key] = value;
        this.setData({
            state
        })
    },
    show_bank() {
        this.setData({
            show_bank: true,
        })
    },
    selectBank(e) {
        let bankid = e.currentTarget.dataset.bankid;
        let {ListBankCreditCard = [], state} = this.data;
        let item = ListBankCreditCard.filter(item => item.BankID == bankid)[0];
        state.CreditCard = state.CreditCard || {};
        state.CreditCard.CreditType = item.BankName;
        this.setData({ state, show_bank: false });

    },
    data: {
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    onLoad: function (options) {
        let app = getApp();
        let routers = getCurrentPages();
        let url = routers[routers.length - 2].__route__;

        this.setData(app.globalData.bak.get(url));


        let CreditCard = this.data.state.CreditCard;
        // 默认选中对应的证件类型
        this.setData({
            state: Object.assign({}, this.data.state, { CreditCard: { IdType: 0 } })
        })

        new Jrequest("HotelApi").get("_GetBankList", {}, data => {

            if (data.BaseResponse.Code == 1) {
                let {ListBankCreditCard} = data;
                this.setData({
                    ListBankCreditCard
                })
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