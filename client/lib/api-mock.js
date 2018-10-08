import Promise from './bluebird'
const QQ_MAP_KEY = 'X4UBZ-4CI66-AGBSA-MAYY3-GEOF6-LXBNX'

// wx.cloud.init({
//   env: 'hao-weather-2752f1'
// })
/**
 *  逆经纬度查询
 * @param {*} lat
 * @param {*} lon
 */
export const geocoder = (lat, lon, success = () => {}, fail = () => {}) => {
  return wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: `${lat},${lon}`,
      key: QQ_MAP_KEY,
      get_poi: 0
    },
    success: success,
    fail: fail
  })
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
}

export const getWeather = (lat, lon) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5030/api/he-weather',
      data: {
        lat,
        lon
      },
      success: (res) => {
        resolve({result: res.data})
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

export const jscode2session = (code) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5030/api/jscode2session',
      data: {
        code
      },
      success: (res) => {
        resolve({result: res.data})
      },
      fail: reject
    })
  })
}
export const getAir = (city) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:5030/api/he-air',
      data: {
        city
      },
      success: (res) => {
        resolve({result: res.data})
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}
