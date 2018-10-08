'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAir = exports.jscode2session = exports.getWeather = exports.geocoder = undefined;

var _bluebird = require('./bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QQ_MAP_KEY = 'X4UBZ-4CI66-AGBSA-MAYY3-GEOF6-LXBNX';
// wx.cloud.init({
//   env: 'hao-weather-2752f1'
// })
/**
 *  逆经纬度查询
 * @param {*} lat
 * @param {*} lon
 */
var geocoder = exports.geocoder = function geocoder(lat, lon) {
  var success = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var fail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

  return wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: lat + ',' + lon,
      key: QQ_MAP_KEY,
      get_poi: 0
    },
    success: success,
    fail: fail
  });
  // return wx.cloud.callFunction({
  //   name: 'geocoder',
  //   data: {
  //     lat,
  //     lon
  //   }
  // })
  //
  // return $.request({
  //   url: SERVER_URL + '/api/geocoder',
  //   data: {
  //     location: `${lat},${lon}`
  //   }
  // })
};
var getWeather = exports.getWeather = function getWeather(lat, lon) {
  return new _bluebird2.default(function (resolve, reject) {
    wx.request({
      url: 'http://127.0.0.1:5030/api/he-weather',
      data: {
        lat: lat,
        lon: lon
      },
      success: function success(res) {
        resolve({ result: res.data });
      },
      fail: function fail(e) {
        reject(e);
      }
    });
  });
};
var jscode2session = exports.jscode2session = function jscode2session(code) {
  return new _bluebird2.default(function (resolve, reject) {
    wx.request({
      url: 'http://127.0.0.1:5030/api/jscode2session',
      data: {
        code: code
      },
      success: function success(res) {
        resolve({ result: res.data });
      },
      fail: reject
    });
  });
};
var getAir = exports.getAir = function getAir(city) {
  return new _bluebird2.default(function (resolve, reject) {
    wx.request({
      url: 'http://127.0.0.1:5030/api/he-air',
      data: {
        city: city
      },
      success: function success(res) {
        resolve({ result: res.data });
      },
      fail: function fail(e) {
        reject(e);
      }
    });
  });
};
//# sourceMappingURL=api-mock.js.map
