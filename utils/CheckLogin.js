const {to} = require("./navigate.js");

function isLogin(){
    if(wx.getStorageSync('checking'))return;
    let jsjid =wx.getStorageSync('jsjid');
    
    if(jsjid==null||jsjid==""){
        try {wx.setStorageSync('checking', true)} catch (e) {}
        to("/pages/member/user/login/index");
        return false;
    }
    else{
        return true;
    }
}

module.exports={
    isLogin
}