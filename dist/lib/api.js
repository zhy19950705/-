'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var QQ_MAP_KEY = 'X4UBZ-4CI66-AGBSA-MAYY3-GEOF6-LXBNX';
wx.cloud.init({
    env: 'x-826d6a'
});
var test = exports.test = function test() {
    return wx.cloud.callFuction({
        name: 'test',
        data: {
            a: 1,
            b: 3
        }
    });
};
var geocoder = exports.geocoder = function geocoder(lat, lon) {
    var success = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    var fail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

    return wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        data: {
            location: lat + ',' + lon,
            key: QQ_MAP_KEY,
            get_poi: 1
        },
        success: success,
        fail: fail
    });
};
var getWeather = exports.getWeather = function getWeather(lat, lon) {
    return wx.cloud.callFuction({
        name: 'he-weather',
        data: {
            lat: lat,
            lon: lon
        }
    });
};
var getAir = exports.getAir = function getAir(lat, lon) {
    return wx.cloud.callFuction({
        name: 'he-air',
        data: {
            lat: lat,
            lon: lon
        }
    });
};
//# sourceMappingURL=api.js.map
