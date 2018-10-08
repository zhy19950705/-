import Chart from '../../lib/chartjs';
/* <remove trigger='prod'> */
import {
    geocoder
} from "../../lib/api";
import {
    getWeather,
    getAir
} from '../../lib/api-mock';
/* </remove> */

/*<jdists trigger="prod">
import {getEmotionByOpenidAndDate, getMood, geocoder, getWeather, getAir} from '../../lib/api'
</jdists>*/

let isUpdate = false
const EFFECT_CANVAS_HEIGHT = 768 / 2
const CHART_CANVAS_HEIGHT = 272 / 2
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
    onLoad() {
        wx.getSystemInfo({
            success: res => {
                let width = res.windowWidth;
                let scale = width / 375;
                this.setData({
                    width,
                    scale,
                    paddingTop: res.statusBarHeight + 12
                })
            }
        })
        // const pages=getCurrentPages();
        // const currentPage=pages[pages.length-1];
        this.getLocation()
    },
    getAddress(lat, lon, name) {
        wx.showLoading({
            title: '定位中',
            mask: true
        })
        let fail = (e) => {
            this.setData({
                address: name || '杭州市西湖区'
            });
            wx.hideLoading();
            // this.getWeatherData()
        }
        geocoder(lat, lon, (res) => {
            wx.hideLoading();
            let result = (res.data || {}).result;
            if (res.statusCode === 200 && result && result.address) {
                let {
                    address,
                    formatted_addresses,
                    address_component
                } = result
                if (formatted_addresses && (formatted_addresses.recommend || formatted_addresses.rough)) {
                    address = formatted_addresses.recommend || formatted_addresses.rough
                }
                let {
                    province,
                    city,
                    district: county
                } = address_component;
                this.setData({
                    province,
                    county,
                    city,
                    address: name || address
                });
                // this.getWeatherData()
            } else {
                fail()
            }
        }, fail)
    },
    updateLocation(res) {
        let {
            latitude: lat,
            longitude: lon,
            name
        } = res;
        let data = {
            lat,
            lon
        }
        if (name) {
            data.address = name
        }
        this.setData(data);
        this.getAddress(lat, lon, name)
    },
    getLocation() {
        wx.getLocation({
            type: 'gcj02',
            success: this.updateLocation,
            fail: (e) => {
                this.openLocation()
            }
        })
    },
    openLocation() {
        wx.showToast({
            title: '检测到您未授权使用位置权限，请先开启哦',
            icon: 'none',
            duration: 3000
        })
    },
    chooseLocation() {
        wx.chooseLocation({
            success: (res) => {
                let {
                    latitude,
                    longitude
                } = res;
                let {
                    lat,
                    lon
                } = this.data;
                if (latitude == lat && lon == longitude) {
                    // this.getWeatherData()
                } else {
                    this.updateLocation(res)
                }
            }
        })
    },
    getWeatherData(cb) {
        wx.showLoading({
            title: '正在加载中',
            mask: true
        });
        const fail = (e) => {
            wx.hideLoading();
            if (typeof cb === 'function') {
                cb()
            };
            wx.showToast({
                title: '加载失败，请稍后重试',
                icon: 'none',
                duration: 3000
            });

        }
        const {
            lat,
            lon,
            province,
            city,
            county
        } = this.data;
        getWeather(lat, lon).then((res) => {
            wx.hideLoading();
            if (typeof cb === 'function') {
                cb()
            }
            if (res.result) {
                this.render(res.result)
            } else {
                fail()
            }
        }).catch(fail)
        getAir(city).then((res => {
            if (res && res.result) {
                this.setData({
                    air: res.result
                })
            }
        })).catch(e => {})
    },

    onPullDownRefresh() {
        this.getWeatherData(() => {
            wx.stopPullDownRefresh()
        })
    },
    onShareAppMessage() {
        if (!isUpdate) {
            return {
                title: '我发现一个好玩的小程序，分享给你看看！',
                path: '/pages/weather/index'
            }
        } else {
            const {
                lat,
                lon,
                address,
                province,
                city,
                county
            } = this.data;
            let url = `/pages/weather/index?lat=${lat}&lon=${lon}&address=${address}&province=${province}&city=${city}&county=${county}`;

            return {
                title: `${address}现在天气情况，快打开看看吧`,
                path: url
            }
        }
    },
    render(data) {
        isUpdate = true;
        const {
            width,
            scale
        } = this.data;
        const {
            hourly,
            daily,
            current,
            lifeStyle,
            oneWord = '',
            effect
        } = data;

        const {
            backgroundColor,
            backgroundImage
        } = current;

        const _today = daily[0],
            _tomorrow = daily[1];

        const today = {
            temp: `${_today.minTemp}/${_today.maxTemp}°`,
            icon: _today.dayIcon,
            weather: _today.day
        };
        const tomorrow = {
            temp: `${_tomorrow.minTemp}/${_tomorrow.maxTemp}`,
            icon: _tomorrow.dayIcon,
            weather: _tomorrow.day
        }

        this.setData({
            hourlyData: hourly,
            weeklyData: daily,
            current,
            backgroundImage,
            backgroundColor,
            today,
            tomorrow,
            oneWord,
            lifeStyle
        })
    },
    drawChart(){
        const {width,scale,weeklyData}=this.data;
        let height=CHART_CANVAS_HEIGHT*scale;
        let ctx=wx.createCanvasContext('chart');

        Chart.pluginService.register({
            afterDatasetsDraw
        })
    }
})