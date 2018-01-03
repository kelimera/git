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
    link: 0,
    type: 0
  },
  //事件处理函数
  onShow: function () {
    var that = this
    wx.request({
      url: networks + 'site.php',
      data: {
        uid: wx.getStorageSync('uid'),
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          site: res.data.result
        })
      }
    })
  },
  onLoad: function (options) {
    var link = options.link
    var type = options.type

    this.setData({
      link: link,
      type: type
    })
  },
  del: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除这个地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '地址删除中',
          })
          wx.request({
            url: networks + 'del.php',
            data: {
              uid: wx.getStorageSync('uid'),
              id: id,
              name: 'site'
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.status == 1) {
                const index = e.currentTarget.dataset.index;
                let site = that.data.site;
                site.splice(index, 1);
                that.setData({
                  site: site
                });
                wx.hideLoading()
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  selectList: function (e) {
    var that = this

    const index = e.currentTarget.dataset.index;
    var site = this.data.site;
    var id = e.currentTarget.dataset.id;

    wx.request({
      url: networks + 'moren.php',
      data: {
        uid: wx.getStorageSync('uid'),
        id: id
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          for (var i = 0; i < site.length; i++) {
            site[i].moren = 0
          };
          site[index].moren = site[index].moren == 1 ? 0 : 1;
          that.setData({
            site: site,
          });
        }
      }

    })

  },
  xuan: function (e) {
    var siteid = e.currentTarget.dataset.siteid
    var link = this.data.link
    var type = this.data.type
    if (link == 1) {
      wx.request({
        url: networks + 'site_selected.php',
        data: {
          uid: wx.getStorageSync('uid'),
          siteid: siteid,
          selected: 1
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.status == 1) {
            wx.navigateBack({
              delta: 1
            })
          }
        }

      })

    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '办公用品配送',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  siteAdd: function () {
    var type = this.data.type
    wx.navigateTo({
      url: '/pages/site/site_add',
    })
  }
})
