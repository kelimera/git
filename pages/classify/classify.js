// pages/type/type.js
var util = require('../../utils/url.js');
var networks = util.network 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class: 0,
    text:null,
    flid:0,
    left:[]
  },

  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: networks + 'fenlei.php',
      data: {},
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          left:res.data.result.nav,
          title: res.data.morentitle,
          flid: res.data.morencid,
          right: res.data.result.cont
        })
      }
    })
    
  },
  class: function(e){
    wx.showLoading({
      title: '加载中',
    })
    var index = e.currentTarget.dataset.index;
    var left = this.data.left;
    var that = this
    var id = e.currentTarget.dataset.id;
    this.setData({
      class: index,
      title: left[index]['title'],
      flid:id
    })
    wx.request({
      url: networks + 'fenlei.php',
      data: {id:id},
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          right: res.data.result.cont
        })
        wx.hideLoading()
      }
    })
  },
  // 跳转商品列表
  list: function (e) {
    var parentid = this.data.flid
    var classid = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/serach/serach?type=3&parentid='+parentid+'&classid='+classid+'&title='+title,
    })
  },

  
})