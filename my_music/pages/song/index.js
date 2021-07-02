// import moment from 'moment'
import request from '../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({
  data: {
    isPlay: false, // 音乐是否播放
    song: {}, // 歌曲详情对象
    musicId: '', // 音乐id
    musicInd: 0, // 音乐下标
    musicLink: '', // 音乐的链接
    currentTime: '00:00',  // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实时进度条的宽度
  },
  onLoad: function (options) {
    let {musicId, musicInd} = options;
    // 获取音乐详情
    this.getMusicInfo(musicId);
    this.setData({
      musicId,
      musicInd: musicInd | 0
    })

    // 判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }

    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 音乐播放
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId;
    });
    // 音乐暂停
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });
    // 音乐停止
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });

    // 监听音乐播放自然结束
    // this.backgroundAudioManager.onEnded(() => {
    // 自动切换至下一首音乐，并且自动播放
    // PubSub.publish('switchType', 'next')
    // // 将实时进度条的长度还原成 0；时间还原成 0；
    // this.setData({
    //   currentWidth: 0,
    //   currentTime: '00:00'
    // })
    // });

    // 监听音乐实时播放的进度
    // this.backgroundAudioManager.onTimeUpdate(() => {
    // // console.log('总时长: ', this.backgroundAudioManager.duration);
    // // console.log('实时的时长: ', this.backgroundAudioManager.currentTime);
    // // 格式化实时的播放时间
    // let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
    // let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450;
    // this.setData({
    //   currentTime,
    //   currentWidth
    // })

    // })
  },
  // 修改播放状态
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 获取音乐详情
  async getMusicInfo(musicId) {
    let songData = await request.get('/song/detail', { ids: musicId });
    // songData.songs[0].dt 单位ms
    // let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: songData.songs[0].name,
      fail: () => {
        wx.showToast({
          title: '网络异常',
          icon: 'error'
        });
      },
    });
    this.setData({
      song: songData.songs[0],
      // durationTime
    })
  },
  // 点击播放/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  // 控制音乐播放/暂停
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        // 获取音乐播放链接
        let musicLinkData = await request.get('/song/url', { id: musicId });
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    } else {
      // 暂停音乐
      this.backgroundAudioManager.pause();
    }
  },

  // 点击切歌的回调
  handleSwitch(event) {
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();

    const musicList = appInstance.globalData.musicList;
    let type = event.currentTarget.id;
    let curIndex = this.data.musicInd;
    if (type === 'pre') {
      curIndex = curIndex === 0 ? musicList.length-1 : curIndex-1;
    } else {
      curIndex = curIndex === musicList.length-1 ? 0 : curIndex+1;
    }
    const id = musicList[curIndex].id;
    this.setData({
      musicInd: curIndex
    })
    // 获取音乐详情信息
    this.getMusicInfo(id);
    // 自动播放当前的音乐
    this.musicControl(true, id);
  },
})
