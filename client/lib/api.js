const QQ_MAP_KEY = 'X4UBZ-4CI66-AGBSA-MAYY3-GEOF6-LXBNX'
wx.cloud.init({
    env: 'x-826d6a'
})

export const test = () => {
    return wx.cloud.callFuction({
        name: 'test',
        data: {
            a: 1,
            b: 3
        }
    })
}

export const geocoder = (lat, lon, success = () => {}, fail = () => {}) => {
    return wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        data: {
            location: `${lat},${lon}`,
            key: QQ_MAP_KEY,
            get_poi: 1
        },
        success,
        fail
    })
}

export const getWeather = (lat, lon) => {
    return wx.cloud.callFuction({
        name: 'he-weather',
        data: {
            lat,
            lon
        }
    })
}

export const getAir = (lat, lon) => {
    return wx.cloud.callFuction({
        name: 'he-air',
        data: {
            lat,
            lon
        }
    })
}