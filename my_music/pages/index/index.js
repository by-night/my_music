// pages/index/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getBannerList();
    this.getRecommendList();
    this.getTopList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getBannerList: async function () {
    const bannerData = await request.get('/banner', { type: 2 });
    this.setData({
      bannerList: bannerData.banners
    })
  },
  getRecommendList: async function () {
    const recommendData = await request.get('/personalized', { limit: 10 });
    this.setData({
      recommendList: recommendData.result
    })
  },
  getTopList: async function () {
    const idxs = [...new Array(5).keys()];
    const reqList = idxs.map(item => request.get('/top/list', { idx: item }));
    Promise.allSettled(reqList).then(res => {
      const topData = res.filter(({ status }) => status === "fulfilled").map(item => {
        const value = item.value.playlist;
        return {
          id: value.id,
          name: value.name,
          tracks: value.tracks.slice(0, 3),
        }
      });
      this.setData({
        topList: topData
      })
    }).catch(err => {
      console.log(err)
    })
  }
})