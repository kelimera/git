//index.js
//获取应用实例
var tcity = require("../../utils/citys.js");
var util = require('../../utils/url.js');
var networks = util.network
var app = getApp()
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    nullHouse: true,
    tips: null,
    xuanImg: '../../images/yuan.png',
    xuanBs: 1,
    add: 0
  },
  //事件处理函数
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  onLoad: function (options) {
    if (options.add) {
      this.setData({
        add: options.add
      })
    }
    console.log(options)
    var that = this;

    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log('初始化完成');


  },
  formBindsubmit: function (e) {
    var that = this;
    var tip;
    var sheng = this.data.province
    var shi = this.data.city
    var xian = this.data.county
    var add = this.data.add
    if (!e.detail.value.name) {
      this.setData({
        tips: '请填写收货人姓名',
        nullHouse: false //弹窗显示
      })
      tip = setTimeout(function () {
        that.setData({
          nullHouse: true,
          tips: null
        })
      }, 1500)
      return false
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(e.detail.value.tel)) {
      this.setData({
        tips: '请填写正确的手机号',
        nullHouse: false //弹窗显示
      })
      tip = setTimeout(function () {
        that.setData({
          nullHouse: true,
          tips: null
        })
      }, 1500)
      return false
    }
    if (sheng == '省') {
      this.setData({
        tips: '请选择收货地址',
        nullHouse: false //弹窗显示
      })
      tip = setTimeout(function () {
        that.setData({
          nullHouse: true,
          tips: null
        })
      }, 1500)
      return false
    }
    if (!e.detail.value.dz) {
      this.setData({
        tips: '请填写详细地址',
        nullHouse: false //弹窗显示
      })
      tip = setTimeout(function () {
        that.setData({
          nullHouse: true,
          tips: null
        })
      }, 1500)
      return false
    }

    wx.showLoading({
      title: '地址保存中',
    })
    wx.request({
      url: networks + 'add_site.php',
      data: {
        name: e.detail.value.name,
        tel: e.detail.value.tel,
        dz: e.detail.value.dz,
        uid: wx.getStorageSync('uid'),
        sheng: sheng,
        shi: shi,
        xian: xian,
        add: add
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})
