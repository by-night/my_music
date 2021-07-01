import config from './config'

const Http = {
    get: (url, data = {}) => {
        return new Promise(resolve => {
            wx.request({
                url: config.host + url,
                data,
                method: 'GET',
                header: {
                    cookie: wx.getStorageSync('cookie')
                },
                success: res => {
                    if (data.isLogin) {
                        const cookie = res.cookies.find(item => item.indexOf("MUSIC_U") !== -1)
                        wx.setStorageSync('cookie', cookie);
                    }
                    resolve(res.data);
                },
                fail: () => {
                    wx.showToast({
                      title: '网络异常',
                      icon: 'error'
                    });
                }
            })
        })
    }
}

export default Http;