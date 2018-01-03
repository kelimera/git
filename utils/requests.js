
var api = require('./apiurl.js'); 
var utils = require('./util.js');
function request(url, data, successCb, errorCb, completeCb) { 
    wx.request({ 
        url: url, 
        method: 'GET', 
        data: data, 
        success: function(res) { 
            utils.isFunction(successCb) && successCb(res); 
            }, 
        error: function() { 
            utils.isFunction(errorCb) && errorCb(); 
            }, 
        complete: function() { 
            utils.isFunction(completeCb) && completeCb(); } 
            }); 
        }
//获取新闻列表
function getNewsList(id, data, successCb, errorCb, completeCb) { 
    console.log(api.getNewsList.replace(':id', id));
    request(api.getNewsList, data, successCb, errorCb, completeCb); 
    }
function getNewsList1(id, data, successCb, errorCb, completeCb) { 
    request(api.getNewsList1, data, successCb, errorCb, completeCb); 
    }

module.exports = { getNewsList:getNewsList,getNewsList1:getNewsList1}