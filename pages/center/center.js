//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/url.js');
var networks = util.network 

Page({
  data: {
    userInfo: {},
    tel:'#'
  },
  //事件处理函数
  call: function(){
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.tel
    })
  },
  orderUrl: function (e) {
    var zt = e.currentTarget.dataset.zt;
    app.globalData.zt = zt;
    wx.switchTab({
      url: '/pages/order/order',
    })
  },
  jifen: function(){
    wx.navigateTo({
      url: '/pages/integral/integral',
    })
  },
  site: function(){
    wx.navigateTo({
      url: '/pages/site/site',
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '奢美汇私人定制中心',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    wx.request({
      url: networks + 'tel.php',
      data: {},
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var content = that.data.content
          if (res.data.status == 1) {
            that.setData({
              tel:res.data.tel,
              // site: res.data.site
              bgt:res.data.bgt
            })
          }
      }
    })
  }
})
