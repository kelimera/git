//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/url.js');
var networks = util.network
Page({
  data: {
    xuanImg: '../../images/yuan.png',
    xuanBs: 1,
    site: [],
    order: [],
    sp: [],
    info: [],
    orderSn: 0
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  del: function (e) {
    wx.showModal({
      content: '确认要删除这个地址吗？',
      success: function (res) {
        wx.showLoading({
          title: '加载中',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 300)


      }
    })
  },
  onLoad: function (options) {
    var orderSn = options.orderSn
    var that = this
    wx.request({
      url: networks + 'order_xq.php',
      data: {
        orderSn: orderSn
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            site: res.data.site,
            order: res.data.order,
            sp: res.data.sp,
            info: res.data.info,
          })
        }

      }
    })
  },
  onShow: function () {
    var that = this
    var zt = this.data.Type
    var orderSn = this.data.orderSn

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
  xuan: function (e) {
    var index = parseInt(e.currentTarget.dataset.bs);
    if (index == 1) {
      this.setData({
        xuanImg: '../../images/xuan.png',
        xuanBs: 2
      })
    } else {
      this.setData({
        xuanImg: '../../images/yuan.png',
        xuanBs: 1
      })
    }
  }

})
