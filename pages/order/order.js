//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/url.js');
var networks = util.network
Page({
  data: {
    hasList: true,
    Type: 4,
    state: true,
    tips2: null,
    nullHouse: true,
    page: 1,
    total: 1,
    tiao: 1,
    top: [
      {
        zt: 4,
        title: '全部'
      },
      {
        zt: 0,
        title: '待付款'
      },
      {
        zt: 1,
        title: '待发货'
      },
      {
        zt: 2,
        title: '待收货'
      },
      {
        zt: 3,
        title: '已完成'
      }
    ],
    shop: null
  },
  //事件处理函数
  onLoad: function (options) {
  },
  onShow: function(){
    var that = this
    var zt = app.globalData.zt
    this.setData({
      Type: zt
    })
    app.globalData.zt = 4;
    console.log(zt)
    var page = 1
    wx.request({
      url: networks + 'order.php',
      data: {
        uid: wx.getStorageSync('uid'),
        zt: zt,
        page: page
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var shop = that.data.shop
        console.log(res)
        if (res.data.status == 1) {
          // if(shop==null){
            shop = res.data.date
          // }else{
          //   for (var i = 0; i < res.data.date.length; i++) {
          //     shop.push(res.data.date[i]);
          //   }
          // }
          that.setData({
            shop: shop,
            hasList: true,
            page: res.data.page,
            total: res.data.total,
            tiao: res.data.tiao,
            pagesize: res.data.pagesize
          })
          if (res.data.tiao < res.data.pagesize && res.data.tiao!=0) {
            that.setData({
              nullHouse: false
            })
          }else{
            that.setData({
              nullHouse: true
            })
          }
        } else {
          that.setData({
            hasList: false,
            nullHouse: true
          })
        }

      }
    })
  },
  pan() {
    var cont = this.data.shop;
    if (!cont.length) {
      this.setData({
        hasList: false
      })
    } else {
      this.setData({
        hasList: true
      })
    }
  },
  del: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认取消这个订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            icon: 'loading'
          })
          wx.request({
            url: networks + 'del.php',
            data: {
              uid: wx.getStorageSync('uid'),
              id: id,
              name: 'order'
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              var shop = that.data.shop
              var arr = []
              if (res.data.status == 1) {
                for (var i = 0; i < shop.length; i++) {
                  if (id !== shop[i].orderSn) {
                    arr.push(shop[i])
                  }
                }
                that.setData({
                  shop: arr
                });
                wx.hideToast();
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1000
                })
              }
              that.pan();
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  shouhuo: function (e) {

    var sn = e.currentTarget.dataset.sn;
    var index = e.currentTarget.dataset.index;
    var that = this
    var type = this.data.Type

    // if(type==4){
    //   let shop = that.data.shop;
    //   shop[index]['zt'] = 3
    //   that.setData({
    //     shop: shop
    //   });
    // }
    wx.showModal({
      title: '提示',
      content: '确认要收货吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            icon: 'loading'
          });
          wx.request({
            url: networks + 'shouhuo.php',
            data: {
              uid: wx.getStorageSync('uid'),
              orderSn: sn
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              if (res.data.status == 1) {
                const index = e.currentTarget.dataset.index;
                let shop = that.data.shop;
                if (type == 4) {
                  shop[index]['zt'] = 3
                } else {
                  shop.splice(index, 1);
                }
                that.setData({
                  shop: shop
                });
                wx.showToast({
                  title: '收货成功',
                  icon: 'success',
                  duration: 2000
                })
                that.pan();
              } else {
                wx.showToast({
                  title: res.data.tips,
                  images: '/pages/image/shibai.png',
                  duration: 2000
                })
              }
              wx.hideToast();
            }
          })
        } else if (res.cancel) {

        }
      }
    })

  },
  tixing: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var sn = e.currentTarget.dataset.sn;
    var index = e.currentTarget.dataset.index;
    var that = this
    wx.request({
      url: networks + 'remind.php',
      data: {
        uid: wx.getStorageSync('uid'),
        orderSn: sn
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == 1) {
          const index = e.currentTarget.dataset.index;
          let shop = that.data.shop;
          shop[index]['remind'] = 1
          that.setData({
            shop: shop
          });
          wx.showToast({
            title: '提醒成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.tips,
            images: '/pages/image/shibai.png',
            duration: 2000
          })
        }
        wx.hideToast();
      }
    })
  },
  detail: function (e) {
    var sn = e.currentTarget.dataset.ordersn;
    wx.navigateTo({
      url: '/pages/order/orders?orderSn=' + sn,
    })
  },
  xiu: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var zt = e.currentTarget.dataset.zt;
    this.setData({
      Type: zt
    })
    var that = this
    wx.request({
      url: networks + 'order.php',
      data: {
        uid: wx.getStorageSync('uid'),
        zt: zt
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            shop: res.data.date,
            hasList: true,
            page: res.data.page,
            total: res.data.total,
            tiao: res.data.tiao,
            pagesize: res.data.pagesize
          })

        } else {
          that.setData({
            hasList: false,
            total: 0,
            tiao: 0
          })
        }
        if (res.data.tiao > 0 && res.data.tiao < res.data.pagesize) {
          that.setData({
            nullHouse: false
          })
        } else {
          that.setData({
            nullHouse: true
          })
        }
        wx.hideToast();

      }
    })
    var tiao = this.data.tiao
    console.log(tiao)
  },
  onReachBottom: function () {
    var that = this
    var zt = this.data.Type
    var page = this.data.page
    var tiao = this.data.tiao
    var total = this.data.total
    var pagesize = this.data.pagesize
    page++
    if (tiao < pagesize || page > total) {
      that.setData({
        nullHouse: false
      })
    } else {
      that.setData({
        state: false,
        tips2: '正在为您加载中'
      })
      wx.request({
        url: networks + 'order.php',
        data: {
          uid: wx.getStorageSync('uid'),
          zt: zt,
          page: page
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          var shop = that.data.shop
          if (res.data.status == 1) {
            for (var i = 0; i < res.data.date.length; i++) {
              shop.push(res.data.date[i]);
            }
            that.setData({
              shop: shop,
              page: res.data.page
            })
          } else {
            that.setData({
              nullHouse: false
            })
          }
          that.setData({
            state: true,
            tips2: null
          })

        }
      })
    }

  },
  zhifu: function (e) {
    var that = this
    var code = e.currentTarget.dataset.code;
    var openid = wx.getStorageSync('openid');
    var price = e.currentTarget.dataset.price;
    var type = this.data.Type
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: 'https://jizhihm.zihaijituan.com//wxpay/example/jsapi.php',
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
        wx.hideLoading()
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
            const index = e.currentTarget.dataset.index;
            let shop = that.data.shop;
            if (type == 4) {
              shop[index]['zt'] = 1
            } else {
              shop.splice(index, 1);
            }
            that.setData({
              shop: shop
            });
            that.pan();
          },
          fail: function (res) {
            wx.showToast({
              title: '取消支付',
              image: '/images/shibai.png',
              duration: 1000
            })
            setTimeout(function () {
            }, 1000)
          }
        })
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
  pan() {
    var shop = this.data.shop
    if (shop.length <= 0) {
      this.setData({
        hasList: false,
        nullHouse: true
      })
    }
  }
})
