import config from './config'

const Http = {
    get: (url, data = {}) => {
        return new Promise((resolve, reject) => {
            wx.request({
                url: config.host + url,
                data,
                method: 'GET',
                success: res => {
                    resolve(res.data);
                },
                fail: err => {
                    reject(err);
                }
            })
        })
    }
}

export default Http;