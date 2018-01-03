//index.js
//获取应用实例
var app = getApp()
var imageUtil = require('../../utils/image.js');
var util = require('../../utils/url.js');
var networks = util.network 

Page({
  data: {
    str:null,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    gid: 0,
    zt:0,
    qisong: false,
    nullHouse: true,
    tips: null,
    normtype:null,
    shop:{},
    norm:[],
    banner: [
      {
        banner: '/images/banner.png'
      }
    ]
  },
  onLoad: function(options){
    var that = this
    var gid = options.gid
    if(gid){
      this.setData({
        gid:gid
      })
    }
    wx.request({
      url: networks + 'detail.php',
      data: {
        gid: gid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          shop: res.data.result,
          banner: res.data.result.banner,
          shop_xq: res.data.result.shop_xq,
          normtype: res.data.result.normtype,
          nr: res.data.result.shop_text,
          norm: res.data.result.norm,
          qisongPrice: res.data.result.priceConf
        })
        if(res.data.result.priceConf<=res.data.result.price){
          that.setData({
            qisong:true
          })
        }
      }
    })
  },
  radioChange: function (e) {
    console.log(e)
    var a = ''
    var data = this.data.norm
    var i = e.currentTarget.dataset.index
    for (var j = 0; j < data[i].detail.length; j++) {
      if (e.detail.value == data[i].detail[j]['id']) {
        data[i].detail[j]['checked'] = true
      } else {
        data[i].detail[j]['checked'] = false
      }
    }
    this.setData({
      norm:data
    })
    var number = 0;
    for (var s = 0; s < data.length; s++) {
      var r = data[s]['detail']
      for (var y = 0; y < r.length; y++) {
        if (r[y].checked == true) {
          a += r[y]['id'] + ','
          number++
        }
      }
    }
    this.setData({
      str:a
    })
    
    var gid = this.data.gid
    var that = this
    if(number==data.length){
      this.setData({
        zt:1
      })

      wx.request({
        url: networks + 'guigePrice.php',
        data: {
          guige: a,
          gid: gid
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          var shop = that.data.shop
          if (res.data.status == 1) {
            shop['price'] = res.data.result
            that.qisong(res.data.result)
          }
          that.setData({
            shop: shop
          })
        }
      })
    }
  },
  qisong:function(price){
    var qisongPrice = this.data.qisongPrice
    var num = this.data.shop.count
    var money = num*price
    if (money >= qisongPrice){
      this.setData({
        qisong: true
      })
    }else{
      this.setData({
        qisong: false
      })
    }
  },
  jian: function () {
    var count = this.data.shop.count;
    if (count > 1) {
      count--;
    }
    var shop = this.data.shop;
    shop.count = count;

    var price = shop.price
    var money = count*price
    var qisongPrice = this.data.qisongPrice
    var qisong = false
    if (money >= qisongPrice){
      qisong = true
    }


    this.setData({
      shop: shop,
      qisong: qisong
    })
  },
  jia: function () {
    var count = this.data.shop.count;
    count++;
    var shop = this.data.shop;
    shop.count = count;

    var price = shop.price
    var money = count * price
    var qisongPrice = this.data.qisongPrice
    var qisong = false
    if (money >= qisongPrice) {
      qisong = true
    }

    this.setData({
      shop: shop,
      qisong: qisong
    })
  },
  jiaCar: function(){
    var data = this.data.norm
    var number = 0;
    var str = ''
    for (var s = 0; s < data.length; s++) {
      var r = data[s]['detail']
      for (var y = 0; y < r.length; y++) {
        if (r[y].checked == true) {
          number++
          str += r[y]['id'] + ','
        }
      }
    }
    
    

      if (number != data.length) {
        wx.showToast({
          title: '请选择规格',
          image: '/images/tan.png',
          duration: 2000
        })
        return false
      } else {
        var gid = this.data.gid
        var num = this.data.shop.count
        var norm = this.data.str
        if (norm == null) {
          norm = str
        }
        var that = this
        
        wx.request({
          url: networks + 'jiaCar.php',
          data: {
            norm: norm,
            gid: gid,
            num: num,
            uid: wx.getStorageSync('uid')
          },
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res)
            if (res.data.status == 1) {
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1500
              })
            } else {
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
          }
        })


      }
    
    
  },
  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  imageLoad2: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidths: imageSize.imageWidth,
      imageheights: imageSize.imageHeight
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
  submit:function(){
    var data = this.data.norm
    var number = 0;
    var str = ''
    for (var s = 0; s < data.length; s++) {
      var r = data[s]['detail']
      for (var y = 0; y < r.length; y++) {
        if (r[y].checked == true) {
          number++
          str += r[y]['id'] + ','
        }
      }
    }
      if (number != data.length) {
        wx.showToast({
          title: '请选择规格',
          image: '/images/tan.png',
          duration: 2000
        })
        return false
      } else {
        var gid = this.data.gid
        var num = this.data.shop.count
        var norm = this.data.str
        if (norm == null) {
          norm = str
        }
        var that = this

        //请求数据库
        wx.request({
          url: networks + 'liji.php',
          data: {
            norm: norm,
            gid: gid,
            num: num,
            uid: wx.getStorageSync('uid')
          },
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            if (res.data.status == 1) {
              wx.redirectTo({
                url: '/pages/order/orderOk?type=1', //这里type 是为了区分 是立即购买还是购物车结算
              })
            } else {
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
          }
        })
      }
  }
})
