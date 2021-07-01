// pages/login/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '15659441699',
    password: 'h1174683095'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 表单输入
  handleInput (event) {
    // todo 防抖
    const type = event.currentTarget.dataset.type;
    const value = event.detail.value;
    this.setData({
      [type]: value
    })
  },
  // 格式校验
  validForm () {
    const { phone, password } = this.data;
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error'
      });
      return false;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      });
      return false;
    }
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机格式不正确',
        icon: 'error'
      });
      return false;
    }
    return true;
  },
  // 登录
  login () {
    const validFlag = this.validForm();
    if (!validFlag) return;

    this.loginReq();
  },
  // 登录请求
  async loginReq () {
    const { phone, password } = this.data;
    const { code, msg, profile } = await request.get('/login/cellphone', { phone, password, isLogin: true });
    if (code === 200) {
      wx.setStorageSync('userInfo', JSON.stringify(profile));
      wx.reLaunch({
        url: '/pages/personal/index'
      });
    } else {
      wx.showToast({
        title: msg || '网络异常',
        icon: 'error'
      });
    }
  }
})