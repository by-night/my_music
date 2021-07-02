import request from '../../utils/request'
Page({
  data: {
    videoGroupList: [],
    videoList: [],
    navId: '',
    videoId: '',
    videoTime: {}, // video 播放时长
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    return {
      title: '视频分享',
      path: '/page/video/index',
    }
  },
  // 获取导航数据
  async getVideoGroupListData() {
    const { data } = await request.get('/video/group/list');
    this.getVideoList(data[0].id);
    this.setData({
      videoGroupList: data.slice(0, 14),
      navId: data[0].id
    })
  },
  // 获取视频列表数据
  async getVideoList(navId) {
    if (!navId) return;
    wx.showLoading({
      title: '正在加载'
    });
    let videoData = await request.get('/video/group', { id: navId });
    this.setData({
      isTriggered: false,
      videoList: videoData.datas.map(item => item.data),
    })
    wx.hideLoading();
  },
  // 点击导航
  changeNav(event) {
    const navId = event.currentTarget.dataset.id;
    this.getVideoList(navId);
    this.setData({
      navId,
      videoList: []
    })
  },
  // 播放
  handlePlay(event) {
    const vid = event.currentTarget.id;
    // (this.vid !== vid) && this.videoContext && this.videoContext.stop();
    // this.vid = vid;
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid);
    this.data.videoTime[vid] && this.videoContext.seek(this.data.videoTime[vid]);
    this.videoContext && this.videoContext.play();
  },
  // 跳转至搜索界面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  // 视频播放进度
  handleTimeUpdate(event) {
    const vid = event.currentTarget.id;
    this.setData({
      ...this.data.videoTime,
      [vid]: event.detail.currentTime
    })
  },
  // 播放结束
  handleEnd (event) {
    const vid = event.currentTarget.id;
    const newVideoObj = this.state.videoTime;
    delete newVideoObj[vid];
    this.setData({
      videoTime: newVideoObj
    })
  },
  // 自定义下拉刷新
  async handleRefresher () {
    this.setData({
      isTriggered: true
    })
    await this.getVideoList(this.data.navId);
  },
  // 上拉触底 
  handleToLower() {
    // todo
  }
})
