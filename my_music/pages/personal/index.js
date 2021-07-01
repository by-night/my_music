// pages/personal/index.
import request from '../../utils/request.js'
let startY = 0;
let moveY = 0;
let moveDistance = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 0,
    coverTransition: '',
    userInfo: {},
    recentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      const data = JSON.parse(userInfo);
      this.getUserRecentPlayList(data.userId)
      this.setData({
        userInfo: data
      });
    }
  },
  async getUserRecentPlayList (uid) {
    const recentPlayData = await request.get('/user/record', {uid, type: 0});
    const data = recentPlayData.allData.splice(0, 10).map(item =>  item.song.al)
    this.setData({
      recentPlayList: data
    })
  },
  handleTouchStart (event) {
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY;
  },
  handleTouchMove (event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if ((moveDistance < 0) || (moveDistance > 80)) {
      return;
    }
    this.setData({
      coverTransform: moveDistance
    })
  },
  handleTouchEnd () {
    this.setData({
      coverTransform: 0,
      coverTransition: 'transform .5s linear'
    })
  },
  // 跳转至登录页
  toLogin () {
    wx.navigateTo({
      url: '/pages/login/index',
    });
  },
})