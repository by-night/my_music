import request from '../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 天
    month: '', // 月
    recommendList: [], // 推荐列表数据
    index: 0, // 点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        success: () => {
          // 跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/index'
          })
        }
      })
    }
    // 更新日期的状态数据
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
  
    // 获取每日推荐的数据
    this.getRecommendList();
  },
  
  // 获取用户每日推荐数据
  async getRecommendList(){
    let {recommend} = await request.get('/recommend/songs');
    this.setData({
      recommendList: recommend
    })
    appInstance.globalData.musicList = recommend;
  },
  
  // 跳转至songDetail页面
  toSongDetail(event){
    const {index, song} = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/song/index?musicId=${song.id}&musicInd=${index}`,
    });
  },
})
