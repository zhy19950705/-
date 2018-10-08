'use strict';

var _chartjs = require('../../lib/chartjs');

var _chartjs2 = _interopRequireDefault(_chartjs);

var _api = require('../../lib/api');

var _apiMock = require('../../lib/api-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* </remove> */
/*<jdists trigger="prod">
import {getEmotionByOpenidAndDate, getMood, geocoder, getWeather, getAir} from '../../lib/api'
</jdists>*/

/* <remove trigger='prod'> */
var isUpdate = false;
var EFFECT_CANVAS_HEIGHT = 768 / 2;
var CHART_CANVAS_HEIGHT = 272 / 2;
Page({
    data: {
        statusBarHeight: 32,
        backgroundImage: '../../images/cloud.jpg',
        backgroundColor: '#62aadc',
        address: '定位中',
        lat: 40.056974,
        lon: 116.307689,
        air: {
            "status": 0,
            "aqi": "77",
            "color": "#00cf9a",
            "name": "良"
        },
        current: {
            temp: '0',
            weather: '数据获取中',
            humidity: '1',
            icon: 'xiaolian'
        },
        today: {
            temp: 'N/A',
            weather: '暂无'
        },
        tomorrow: {
            temp: 'N/A',
            weather: '暂无'
        },
        hourlyData: [],
        // 一周天气数据
        weeklyData: [],
        // 生活指数
        lifeStyle: [],
        scale: 1,
        width: 375
    },
    onLoad: function onLoad() {
        var _this = this;

        wx.getSystemInfo({
            success: function success(res) {
                var width = res.windowWidth;
                var scale = width / 375;
                _this.setData({
                    width: width,
                    scale: scale,
                    paddingTop: res.statusBarHeight + 12
                });
            }
        });
        // const pages=getCurrentPages();
        // const currentPage=pages[pages.length-1];
        this.getLocation();
    },
    getAddress: function getAddress(lat, lon, name) {
        var _this2 = this;

        wx.showLoading({
            title: '定位中',
            mask: true
        });
        var fail = function fail(e) {
            _this2.setData({
                address: name || '杭州市西湖区'
            });
            wx.hideLoading();
            // this.getWeatherData()
        };
        (0, _api.geocoder)(lat, lon, function (res) {
            wx.hideLoading();
            var result = (res.data || {}).result;
            if (res.statusCode === 200 && result && result.address) {
                var address = result.address,
                    formatted_addresses = result.formatted_addresses,
                    address_component = result.address_component;

                if (formatted_addresses && (formatted_addresses.recommend || formatted_addresses.rough)) {
                    address = formatted_addresses.recommend || formatted_addresses.rough;
                }
                var province = address_component.province,
                    city = address_component.city,
                    county = address_component.district;

                _this2.setData({
                    province: province,
                    county: county,
                    city: city,
                    address: name || address
                });
                // this.getWeatherData()
            } else {
                fail();
            }
        }, fail);
    },
    updateLocation: function updateLocation(res) {
        var lat = res.latitude,
            lon = res.longitude,
            name = res.name;

        var data = {
            lat: lat,
            lon: lon
        };
        if (name) {
            data.address = name;
        }
        this.setData(data);
        this.getAddress(lat, lon, name);
    },
    getLocation: function getLocation() {
        var _this3 = this;

        wx.getLocation({
            type: 'gcj02',
            success: this.updateLocation,
            fail: function fail(e) {
                _this3.openLocation();
            }
        });
    },
    openLocation: function openLocation() {
        wx.showToast({
            title: '检测到您未授权使用位置权限，请先开启哦',
            icon: 'none',
            duration: 3000
        });
    },
    chooseLocation: function chooseLocation() {
        var _this4 = this;

        wx.chooseLocation({
            success: function success(res) {
                var latitude = res.latitude,
                    longitude = res.longitude;
                var _data = _this4.data,
                    lat = _data.lat,
                    lon = _data.lon;

                if (latitude == lat && lon == longitude) {
                    // this.getWeatherData()
                } else {
                    _this4.updateLocation(res);
                }
            }
        });
    },
    getWeatherData: function getWeatherData(cb) {
        var _this5 = this;

        wx.showLoading({
            title: '正在加载中',
            mask: true
        });
        var fail = function fail(e) {
            wx.hideLoading();
            if (typeof cb === 'function') {
                cb();
            };
            wx.showToast({
                title: '加载失败，请稍后重试',
                icon: 'none',
                duration: 3000
            });
        };
        var _data2 = this.data,
            lat = _data2.lat,
            lon = _data2.lon,
            province = _data2.province,
            city = _data2.city,
            county = _data2.county;

        (0, _apiMock.getWeather)(lat, lon).then(function (res) {
            wx.hideLoading();
            if (typeof cb === 'function') {
                cb();
            }
            if (res.result) {
                _this5.render(res.result);
            } else {
                fail();
            }
        }).catch(fail);
        (0, _apiMock.getAir)(city).then(function (res) {
            if (res && res.result) {
                _this5.setData({
                    air: res.result
                });
            }
        }).catch(function (e) {});
    },
    onPullDownRefresh: function onPullDownRefresh() {
        this.getWeatherData(function () {
            wx.stopPullDownRefresh();
        });
    },
    onShareAppMessage: function onShareAppMessage() {
        if (!isUpdate) {
            return {
                title: '我发现一个好玩的小程序，分享给你看看！',
                path: '/pages/weather/index'
            };
        } else {
            var _data3 = this.data,
                lat = _data3.lat,
                lon = _data3.lon,
                address = _data3.address,
                province = _data3.province,
                city = _data3.city,
                county = _data3.county;

            var url = '/pages/weather/index?lat=' + lat + '&lon=' + lon + '&address=' + address + '&province=' + province + '&city=' + city + '&county=' + county;
            return {
                title: address + '\u73B0\u5728\u5929\u6C14\u60C5\u51B5\uFF0C\u5FEB\u6253\u5F00\u770B\u770B\u5427',
                path: url
            };
        }
    },
    render: function render(data) {
        isUpdate = true;
        var _data4 = this.data,
            width = _data4.width,
            scale = _data4.scale;
        var hourly = data.hourly,
            daily = data.daily,
            current = data.current,
            lifeStyle = data.lifeStyle,
            _data$oneWord = data.oneWord,
            oneWord = _data$oneWord === undefined ? '' : _data$oneWord,
            effect = data.effect;
        var backgroundColor = current.backgroundColor,
            backgroundImage = current.backgroundImage;

        var _today = daily[0],
            _tomorrow = daily[1];
        var today = {
            temp: _today.minTemp + '/' + _today.maxTemp + '\xB0',
            icon: _today.dayIcon,
            weather: _today.day
        };
        var tomorrow = {
            temp: _tomorrow.minTemp + '/' + _tomorrow.maxTemp,
            icon: _tomorrow.dayIcon,
            weather: _tomorrow.day
        };
        this.setData({
            hourlyData: hourly,
            weeklyData: daily,
            current: current,
            backgroundImage: backgroundImage,
            backgroundColor: backgroundColor,
            today: today,
            tomorrow: tomorrow,
            oneWord: oneWord,
            lifeStyle: lifeStyle
        });
    },
    drawChart: function drawChart() {
        var _data5 = this.data,
            width = _data5.width,
            scale = _data5.scale,
            weeklyData = _data5.weeklyData;

        var height = CHART_CANVAS_HEIGHT * scale;
        var ctx = wx.createCanvasContext('chart');
        _chartjs2.default.pluginService.register({
            afterDatasetsDraw: afterDatasetsDraw
        });
    }
});
//# sourceMappingURL=index.js.map
