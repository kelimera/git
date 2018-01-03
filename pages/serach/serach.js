var app = getApp()
var util = require('../../utils/url.js');
var networks = util.network 
Page({
  data: {
    sxk:false,
    animation: '',
    hidden:true,
    type:0,
    Height:0,
    ppt:0,
    min: '',
    max: '',
    page:1,
    total:null,
    tiao:null,
    state: true,
    tips2: null,
    xgsp: true,
    value: '',
    parentid:0,
    classid: 0,
    top: 0,
    tops: 0,
    serachstate: 1,
    status: 1,
    nullHouse: true,
    sai:[
      {
        title:'综合',
        pic:true
      },
      {
        title: '价格',
        pic: true
      },
      {
        title: '品牌',
        pic: true
      },
    ],
  },
 

  onLoad: function(options){
    // type
    // 1 从首页搜索进来的
    // 2 点击一级分类进来的
    // 3 点击二级分类进来的
    var type = 0
    var parentid = 0
    var classid = 0
    var value = 'fuck'
    wx.showLoading({
      title: '加载中',
    })
    if (options.type){
      this.setData({
        type:options.type
      })
      type=options.type
    }
    if(options.parentid){
      this.setData({
        parentid: options.parentid
      })
      parentid = options.parentid
    }
    if (options.classid) {
      this.setData({
        classid: options.classid
      })
      classid = options.classid
    }
    if (options.value){
      this.setData({
        value: options.value
      })
      value = options.value
    }
    var that = this
    this.getpp()
    
    wx.request({
      url: networks + 'list.php',
      data: {
        type: type,
        parentid: parentid,
        classid: classid,
        value: value
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if(res.data.status==1){
          that.setData({
            shop: res.data.result,
            page: res.data.page,
            total: res.data.total,
            tiao: res.data.tiao,
            pagesize: res.data.pagesize
          })
            that.setData({
              xgsp: true,
            })
            if (res.data.tiao <= res.data.pagesize) {
              that.setData({
                nullHouse: false,
              })
            } else {
              that.setData({
                nullHouse: true,
              })
            }
        }else{
            that.setData({
              xgsp: false,
            })
        }
        wx.hideLoading()
      }
    })

    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    
  },
  fenlei: function () {
    wx.redirectTo({
      url: '/pages/classify/classify'
    })
  },

  // 输入搜索触发 将筛选条件归0
  ss: function (e) {
    var value = e.detail.value;
    var that = this
    this.setData({
      value: value,
      min: '',
      max: '',
      ppt: 0,
      serachstate: 2
    })
    var type = this.data.type
    var parentid = this.data.parentid
    var classid = this.data.classid

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: networks + 'list.php',
      data: {
        type: type,
        parentid: parentid,
        classid: classid,
        value: value
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            shop: res.data.result,
            page: res.data.page,
            total: res.data.total,
            tiao: res.data.tiao,
            xgsp: true,
            pagesize: res.data.pagesize
          })
          if (res.data.tiao <= res.data.pagesize) {
            that.setData({
              nullHouse: false,
            })
          } else {
            that.setData({
              nullHouse: true,
            })
          }
        } else {
          
            that.setData({
              xgsp: false,
            })

        }
        wx.hideLoading()
      }
    })
    this.hiddenss()

    
  },

  serach: function(){
    var min = this.data.min
    var max = this.data.max
    var brandid = this.data.ppt
    var type = this.data.type
    var parentid = this.data.parentid
    var classid = this.data.classid
    var value = this.data.value
    var page = 1
    var that = this
    this.setData({
      serachstate: 2,
      tops: 0
    })
   
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: networks + 'list.php',
      data: {
        min: min,
        max: max,
        brandid: brandid,
        type: type,
        parentid: parentid,
        classid: classid,
        value: value,
        page: page
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            shop: res.data.result,
            page: res.data.page,
            total: res.data.total,
            tiao: res.data.tiao,
            pagesize: res.data.pagesize
          })
          if (res.data.tiao <= res.data.pagesize) {
            that.setData({
              nullHouse: false,
            })
          }else{
            that.setData({
              nullHouse: true,
            })
          }
          that.setData({
            xgsp: true,
          })
        } else {
          that.setData({
            xgsp: false,
          })
        }

        wx.hideLoading()
      }
    })
  },

  // 点击某个品牌 修改样式
  brand:function(e){
    var id = e.currentTarget.dataset.id;
    var that = this
    that.setData({
      ppt: id
    })
  },

  // 筛选品牌
  ppSerach:function(e){
    this.serach()
    this.hiddenss()
  },

  // 筛选价格
  priceSerach:function(e){
    var min = e.detail.value.min
    var max = e.detail.value.max
    var that = this
    that.setData({
      min:min,
      max:max,
    })
    that.serach()
    that.hiddenss()
  },

  
  zonghe: function(){
    var zonghe = this.data.sai[0]['pic']
    var type = this.data.type
    var parentid = this.data.parentid
    var classid = this.data.classid
    var value = this.data.value
    var page = 1
    var that = this
    this.setData({
      min: '',
      max: '',
      ppt: 0,
      tops: 0
    })
       
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: networks + 'list.php',
      data: {
        type: type,
        parentid: parentid,
        classid: classid,
        value: value,
        zonghe: zonghe,
        page: page
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            shop: res.data.result,
            page: res.data.page,
            total: res.data.total,
            tiao: res.data.tiao,
            pagesize: res.data.pagesize
          })
          if (res.data.tiao <= res.data.pagesize) {
            that.setData({
              nullHouse: false,
            })
          } else {
            that.setData({
              nullHouse: true,
            })
          }
          that.setData({
            xgsp: true,
          })
        } else {
          that.setData({
            xgsp: false,
          })
        }

        wx.hideLoading()
      }
    })
  },
  
  // 获取品牌列表
  getpp:function(){
    var that = this
    wx.request({
      url: networks + 'pp.php',
      data: {},
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          pp: res.data.pp
        })
      }
    })
  },
  
  // 点击三个筛选条件 更改样式
  sx: function(e){
    var index = e.currentTarget.dataset.index;
    var sai = this.data.sai;
    for(var i=0;i<sai.length;i++){
      if(i==index){
        sai[i]['pic'] = !sai[i]['pic']
      }else{
        sai[i]['pic'] = true
      }
    }
    this.setData({
      sai: sai
    })
    this.sxk(index) 
    if(index==0){
      this.zonghe()
    }
  },

  // 筛选下拉框
  sxk: function(index){
    var sai = this.data.sai
    var sxk = false
    for (var i = 0; i < sai.length;i++){
      if (sai[i]['pic']==false){
        sxk = true
        
      }
    }
    if (index == 1) {
      this.price()
      if (sxk == false) {
        this.hidden()
      }
    } else if (index == 2) {
      this.pinpai()
      if (sxk == false) {
        this.hidden()
      }
    }else{
      this.hidden()
    }
    this.setData({
      sxk:sxk
    })
    
  },


  hidden(){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out'
    })
    animation.opacity(0).height(0).step();//修改透明度,放大 

    var xiaohei = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out'
    })
    xiaohei.opacity(0).step();//修改透明度,放大 
    this.setData({
      animation: animation.export(),
      xiaohei: xiaohei.export(),
      // sai:sai
    })
    var that = this
    setTimeout(function () {
      that.setData({
        hidden: true
      });
    }, 200);
  },
  hiddens() {
    
    this.hidden()
    var sai = this.data.sai
    for (var i = 0; i < sai.length; i++) {
      sai[i]['pic'] = true
    }
    this.setData({
      sai:sai,
      ppt:0,
      min:'',
      max:''
    })
    
  },
  hiddenss() {

    this.hidden()
    var sai = this.data.sai
    for (var i = 0; i < sai.length; i++) {
      sai[i]['pic'] = true
    }
    this.setData({
      sai: sai
    })

  },
  

  // 点击 价格
  price(){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out'
    })
    animation.opacity(1).height('280rpx').step();//修改透明度,放大 
    this.setData({
      animation: animation.export(),
      types: 1,
      hidden: false
    })
    this.xiaohei()
  },

  // 点击 遮罩层
  xiaohei(){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out'
    })
    animation.opacity(0.3).step();//修改透明度,放大 
    this.setData({
      xiaohei: animation.export(),
    })
  },

  // 跳转 商品详情
  detail: function (e) {
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/detail/detail?gid=' + gid,
    })
  },

  // 点击 品牌
  pinpai(){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out'
    })
    animation.opacity(1).height('600rpx').step();//修改透明度,放大  
    this.setData({
      animation: animation.export(),
      types: 2,
      hidden: false
    })
    this.xiaohei()
  },

  // 分享
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
  scroll:function(e){
    this.setData({
      top: e.detail.scrollTop
    })
  },
  // 底部触发
  lower: function(){
    var that = this
    var status = this.data.status
    
    if(status==1){
      this.setData({
        status:2
      })
      setTimeout(function () {
        that.setData({
          status:1
        });
      }, 1000);
      var min = this.data.min
      var max = this.data.max
      var brandid = this.data.ppt
      var type = this.data.type
      var parentid = this.data.parentid
      var classid = this.data.classid
      var value = this.data.value

      var serachstate = this.data.serachstate

      if (serachstate == 1) {
        value = 'fuck'
      }

      var page = this.data.page
      var total = this.data.total
      var zonghe = this.data.sai[0]['pic']
      page++
      if (page <= total) {
        that.setData({
          state: false,
          tips2: '正在为您加载中'
        })
        wx.request({
          url: networks + 'list.php',
          data: {
            type: type,
            parentid: parentid,
            classid: classid,
            value: value,
            zonghe: zonghe,
            min: min,
            max: max,
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
              for (var i = 0; i < res.data.result.length; i++) {
                shop.push(res.data.result[i]);
              }
              that.setData({
                shop: shop,
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
              that.setData({
                xgsp: true,
                state: true,
                tips2: null
              })
            } else {
              that.setData({
                xgsp: false,
              })
            }

            // wx.hideLoading()
          }
        })
      }
    }
    
  }

})
