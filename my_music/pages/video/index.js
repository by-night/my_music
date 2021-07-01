import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
  },
  
  // 获取导航数据
  async getVideoGroupListData(){
    const {data} = await request.get('/video/group/list');
    // 获取视频列表数据
    this.getVideoList(data[0].id);
    this.setData({
      videoGroupList: data.slice(0, 14),
      navId: data[0].id
    })
  
  },
  // 获取视频列表数据
  async getVideoList(navId){
    if(!navId) return;
    let videoListData = await request.get('/video/group', {id: navId});
    console.log(videoListData)
  },
  
  // 点击切换导航的回调
  changeNav(event){
    const navId = event.currentTarget.dataset.navId;
    this.setData({
      navId,
      videoList: []
    })
  },
  
  // 跳转至搜索界面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

})
