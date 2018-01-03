  //index.js
//获取应用实例
var util = require('../../utils/url.js');
var networks = util.network 

var app = getApp()
Page({
  data: {
    totalPrice: '0.00',
    allCount: 0,
    xuanBs:1,
    allBs:1,
    xuanImg: '../../images/yuan.png',
    selectAllStatus: false,
    hasList: false,
    content:[],
    nullHouse: true,
    tips: null,
    qisong: false,
    priceConf: 0
    
  },
  onLoad: function (options) {
    this.getTotalPrice();
    this.getAll();
    this.pan();
  },
  onShow() {
    var uid = wx.getStorageSync('uid');
    var that = this
    console.log(uid)
    wx.request({
      url: networks + 'car.php',
      data: {
        uid: uid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            qisongPrice: res.data.priceConf,
            content: res.data.result,
            hasList: true,
          })
        } else {
          that.setData({
            hasList: false
          })
        }
        that.setData({
          selectAllStatus: false,
          totalPrice: '0.00',
          allCount:0
        })

      }
    })
    
    this.getTotalPrice();
    this.getAll();
    this.pan();
  },
  jian: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var count = this.data.content[index].count;
    var gid = e.currentTarget.dataset.gid;
    var normid = e.currentTarget.dataset.normid;
    var carid = e.currentTarget.dataset.carid;
    var that = this
    var content = that.data.content;
    if(count>1){
      count--;
    }
    wx.request({
      url: networks + 'car_num.php',
      data: {
        uid: wx.getStorageSync('uid'),
        num: count,
        normid: normid,
        gid: gid,
        carid: carid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var contents = that.data.content;
        if(res.data.status==1){
          if (contents[index].selected == 'falsee') {
            contents[index].selected = false;
            that.setData({
              content: contents
            })
          }
        }
      }
    })
    
    content[index].count = count;
    that.setData({
      content:content
    });
    this.getTotalPrice(); 
  },
  jia: function(e){
    var index = e.currentTarget.dataset.index;
    var gid = e.currentTarget.dataset.gid;
    var normid = e.currentTarget.dataset.normid;
    var carid = e.currentTarget.dataset.carid;
    var max = e.currentTarget.dataset.max;
    
    var that = this
    var count = that.data.content[index].count;
    count++;
    if (count>max){
      that.setData({
        tips: '该商品库存剩余'+max,
        nullHouse: false //弹窗显示
      })
      setTimeout(function () {
        that.setData({
          nullHouse: true,
          tips: null
        })
      }, 3000)
      return false
    }
    
    var aa = true
    wx.request({
      url: networks + 'car_num.php',
      data: {
        uid: wx.getStorageSync('uid'),
        num: count,
        normid: normid,
        gid: gid,
        carid: carid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
      }
    })
    var content = that.data.content;
    content[index].count = count;
    console.log(content[index].selected)
    that.setData({
      content: content
    });
    that.getTotalPrice(); 
  },
  del: function(e){
    var id = e.currentTarget.dataset.id;
    
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认要删除这个商品吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: networks + 'del.php',
            data: {
              uid: wx.getStorageSync('uid'),
              id:id,
              name: 'cart'
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              var content = that.data.content
              var arr = []
              if(res.data.status==1){
                for(var i=0;i<content.length;i++){
                  if(id!==content[i].id){
                    arr.push(content[i])
                  }
                }
                that.setData({
                  content: arr
                })
                that.getTotalPrice();                           // 重新获取总价
                that.getAll();
                that.pan();
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // fangwen(){
  //   var uid = wx.getStorageSync('uid');
  //   var that = this
  //   wx.request({
  //     url: networks + 'car.php',
  //     data: {
  //       uid: uid
  //     },
  //     method: "POST",
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     success: function (res) {
  //       console.log(res)
  //       if (res.data.status == 1) {
  //         that.setData({
  //           content: res.data.result,
  //           hasList: true
  //         })
  //       } else {
  //         that.setData({
  //           hasList: false
  //         })
  //       }


  //     }
  //   })
  // },
  selectList:function (e) {
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var content = this.data.content;                    // 获取购物车列表
    const selected = content[index].selected;         // 获取当前商品的选中状态
    content[index].selected = !selected;              // 改变状态
    this.setData({
      content: content,
    });
    this.getTotalPrice();                           // 重新获取总价
    this.getAll();
    
  },
  getAll: function(){                               //判断是否全选
    var content = this.data.content;                  
    var num = 0;
    var selectAllStatus = false;
    for (var i = 0; i < content.length; i++) {         
      if (content[i].selected) {                   
        num++;
      }
    }
    if(num!==0&&num==content.length){
      selectAllStatus=true
    }else{
      selectAllStatus=false
    }
    this.setData({
      selectAllStatus: selectAllStatus
    })
  },
  getTotalPrice() {                               // 获取商品总价
    var content = this.data.content;
    // console.log(content)
    var total = 0;
    var num = 0;
    for (var i = 0; i < content.length; i++) {         
      if (content[i].selected==true) {                   // 判断选中才会计算价格
        total += content[i].count * content[i].price;     // 所有价格加起来
        num += content[i].count;
      }
    }
    var qisong = false
    var qisongPrice = this.data.qisongPrice
    if (total >= qisongPrice) {
        qisong=true
    } 
    this.setData({                                // 最后赋值到data中渲染到页面
      content: content,
      totalPrice: total.toFixed(2),
      allCount:num,
      qisong: qisong
    });
  },
  selectAll:function (e) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let content = this.data.content;

    for (let i = 0; i < content.length; i++) {
      if (content[i].selected!=='falsee'){
        content[i].selected = selectAllStatus;            // 改变所有商品状态
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      content: content
    });
    this.getTotalPrice();                               // 重新获取总价
  },
  pan(){
    var cont = this.data.content;
    if (!cont.length){
      this.setData({
        hasList:false
      })
    }else{
      this.setData({
        hasList: true
      })
    }
  },
  submit: function(){                                   // 将商品id放进数组
    var content = this.data.content;
    var acc=''
    var shu = 0
    var that = this
    for(var i=0;i<content.length;i++){
      if(content[i].selected==true){
          acc+="'"+content[i].id+"'"+','
          shu++

      }
    }
    var str1 = acc.substring(0, acc.length - 1);
    if (shu < 1) {
      that.setData({
        tips: '请选择需要的商品',
        nullHouse: false //弹窗显示
      })
      setTimeout(function () {
        that.setData({
          nullHouse: true,
          tips: null
        })
      }, 3000)
    } else {
      wx.navigateTo({
        url: '/pages/order/orderOk?type=2&carid=' + str1,
      })
    }
    
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
  qu: function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})
