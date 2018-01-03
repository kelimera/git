//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/url.js');
var networks = util.network 

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    nullHouse:true,
    banner: [
      {
        pic:'/images/banner.png'
      }
    ]
  },
  onLoad: function (options) {
    
  },
  onShow: function(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: networks + 'index.php',
      data: {},
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      success: function (res) {
        console.log(res)
        that.setData({
          banner: res.data.banner,
          nav: res.data.nav,
          gg: res.data.gg,
          navs: res.data.navs,
          hot: res.data.hot,
          page: res.data.page,
          total: res.data.total,
          tiao: res.data.tiao,
          pagesize: res.data.pagesize
        })
        if (res.data.tiao <= res.data.pagesize) {
          that.setData({
            nullHouse: false
          })
        } else {
          that.setData({
            nullHouse: true
          })
        }
        wx.hideLoading()

      }
    })
  },

  // 跳转商品详情
  detail:function(e){
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/detail/detail?gid='+gid,
    })
  },

  // 跳转商品列表
  fenlei: function(){
    wx.navigateTo({
      url: '/pages/classify/classify'
    })
  },

  // 跳转商品列表
  list: function(e){
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/serach/serach?type=2&parentid='+id+'&title='+title,
    })
  },

  // 跳转搜索页
  ss: function (e) {
    var value = e.detail.value;
    this.setData({
      value:null
    })
    wx.navigateTo({
      url: '/pages/serach/serach?type=1&value=' + value,
    })
  },
  onReachBottom: function () {
    var page = this.data.page
    var total = this.data.total
    page++
    if(page<=total){
      var that = this
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: networks + 'index.php',
        data: {
          page:page
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },

        success: function (res) {
          console.log(res)
          var hot = that.data.hot
          if (res.data.status == 1) {
            for (var i = 0; i < res.data.hot.length; i++) {
              hot.push(res.data.hot[i]);
            }
            that.setData({
              hot: hot,
              page: res.data.page,
              total: res.data.total,
              tiao: res.data.tiao,
              pagesize: res.data.pagesize
            })
            if (res.data.page <= res.data.total) {
              that.setData({
                nullHouse: false,
              })
            } else {
              that.setData({
                nullHouse: true,
              })
            }
          }
          wx.hideLoading()

        }
      })
    }
  }
})
