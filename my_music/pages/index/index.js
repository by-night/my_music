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
  async getBannerList () {
    const bannerData = await request.get('/banner', { type: 2 });
    this.setData({
      bannerList: bannerData.banners
    })
  },
  async getRecommendList () {
    const recommendData = await request.get('/personalized', { limit: 10 });
    this.setData({
      recommendList: recommendData.result
    })
  },
  async getTopList () {
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