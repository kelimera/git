//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/url.js');
var networks = util.network
Page({
  data: {
    xuanImg: '../../images/yuan.png',
    xuanBs: 1,
    content: [],
    zong: 0,
    number: 0,
    heji: 0,
    yunfei: 0,
    name: '',
    tel: '',
    shi: '',
    xian: '',
    dz: '',
    carid: '',
    type: 0,
    siteid: 0,
    nullHouse: true,
    tips: null,
    sitestate: true
  },
  //事件处理函数
  onLoad: function (options) {
    var that = this
    var type = options.type
    if (options.carid) {
      var carid = options.carid
      this.setData({
        carid: carid
      })

    } else {
      var carid = -1
    }

    if (options.siteid) {
      var siteid = options.siteid
    } else {
      var siteid = -1
    }
    this.setData({
      type: type
    })
    wx.request({
      url: networks + 'orderOk.php',
      data: {
        uid: wx.getStorageSync('uid'),
        type: type,
        carid: carid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var content = that.data.content
        if (res.data.status == 1) {

          that.setData({
            content: res.data,
            zong: res.data.zong,
            yunfei: res.data.yunfei,
            heji: res.data.heji,
            number: res.data.number,

          })
          if (res.data.site.status == 1) {
            that.setData({
              sitestate: true,
              name: res.data.site.name,
              tel: res.data.site.tel,
              shi: res.data.site.shi,
              xian: res.data.site.xian,
              dz: res.data.site.dz,
              siteid: res.data.site.siteid
            })
          } else {
            that.setData({
              sitestate: false
            })
          }
        }
      }
    })
  },
  onShow: function () {
    var that = this
    wx.request({
      url: networks + 'site_selected.php',
      data: {
        uid: wx.getStorageSync('uid')
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var content = that.data.content
        if (res.data.num > 0) {

          if (res.data.status == 1) {

            that.setData({
              sitestate: true,
              name: res.data.site.name,
              tel: res.data.site.tel,
              shi: res.data.site.shi,
              xian: res.data.site.xian,
              dz: res.data.site.dz,
              siteid: res.data.site.siteid

            })
          }
        } else {
          that.setData({
            sitestate: false
          })
        }

      }
    })
  },
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
  },
  site: function () {
    var type = this.data.type
    var state = this.data.sitestate
    if (state) {
      wx.navigateTo({
        url: '/pages/site/site?link=1&type=' + type
      })
    } else {
      wx.navigateTo({
        url: '/pages/site/site_add?add=1'
      })
    }

    // 如果根据link 判断是否是从订单点进去的  如果link不等于1 选完不跳转 type 是判断立即购买还是购物车购买
  },
  order: function () {
    var siteid = this.data.siteid
    var type = this.data.type
    var that = this
    var cartid = this.data.carid
    var state = this.data.sitestate
    if (!state) {
      wx.showToast({
        title: '请添加地址信息',
        image: '/images/tan.png',
        duration: 2000
      })
      return false
    }
    wx.showLoading({
      title: '订单生成中',
    })
    wx.request({
      url: networks + 'orderSubmit.php',
      data: {
        uid: wx.getStorageSync('uid'),
        siteid: siteid,
        oderType: type,
        cartid: cartid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          var code = res.data.code;
          var openid = wx.getStorageSync('openid');
          var price = res.data.price;
          wx.request({
            url: 'https://jizhihm.zihaijituan.com/wxpay/example/jsapi.php',
            data: {
              openid: openid,
              code: code,
              price: price
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              var prepay = res.data.content.package //prepay_id
              var sign = res.data.content.paySign  //签名
              var times = res.data.content.timeStamp  //时间戳
              var randomString = res.data.content.nonceStr //32位随机字符串
              var signType = res.data.content.signType //  签名类型
              wx.requestPayment({
                timeStamp: times,
                nonceStr: randomString,
                package: prepay,
                signType: signType,
                paySign: sign,
                success: function (res) {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                },
                fail: function (res) {
                  wx.showToast({
                    title: '取消支付',
                    image: '/images/shibai.png',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              })
            }
          })

        }else if (res.data.status == 3){
          that.setData({
            tips: res.data.tips,
            nullHouse: false //弹窗显示
          })
          setTimeout(function () {
            that.setData({
              nullHouse: true,
              tips: null
            })
            wx.switchTab({
              url: '/pages/order/order',
            })
          }, 2000)
        }else {
          that.setData({
            tips: res.data.tips,
            nullHouse: false //弹窗显示
          })
          setTimeout(function () {
            that.setData({
              nullHouse: true,
              tips: null
            })
          }, 3000)
        }
        wx.hideToast()
      }
    })
  }
})
