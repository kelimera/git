//app.js
var util = require('/utils/url.js');
var networks = util.network

var userInfo = [];
App({
  onLaunch: function () {
    wx.clearStorage()
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo();
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: networks + 'getopid.php',
            data: {
              code: res.code
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              wx.setStorage({
                key: 'openid',
                data: res.data,
              })
              var openid = res.data
              wx.getUserInfo({
                success: function (res2) {
                  var name = res2.userInfo.nickName //昵称
                  var pic = res2.userInfo.avatarUrl //头像
                  var sex = res2.userInfo.gender //性别
                  wx.request({
                    url: networks + 'member.php',
                    data: {
                      name: name,
                      pic: pic,
                      openid: openid,
                      sex: sex
                    },
                    method: "POST",
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (res) {
                      console.log(res)
                      wx.setStorageSync('uid', res.data.uid)// 将用户id存进缓存
                    }
                  })
                },
                fail: function () {
                  wx.clearStorage()
                }
              })

            }
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    zt:4
  }
})
