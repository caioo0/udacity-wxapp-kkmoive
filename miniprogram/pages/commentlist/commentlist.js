const db = require('../../utils/db')
const util = require('../../utils/util')
const constant = require('../../utils/constant')
let timer = null;
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    pagenum: 0,
    commentlist: [],
    startPlay: false,
    movieId:'',
    audioStatus: [] //各影评的影评播放状态，用户播放按钮渲染
  },
  onLoad: function (options) { 
    this.setData({
      movieId: options.movieId
    })
    this.getcommentlist()
    wx.showLoading({
      title: '正在加载...',
    })
  },
  onReachBottom: function () {
    let pagenum = this.data.pagenum + 1
    this.setData({
      pagenum: pagenum
    })
    this.getcommentlist()
  },
  getcommentlist() {
    let page = this.data.pagenum
    let movieId = this.data.movieId
 
    db.getMovieComments(page, movieId).then(res => {
      wx.hideLoading()
      let curcommentlist = res.result.data
      let origincommentlist = this.data.commentlist;
      let commentlist = origincommentlist.concat(curcommentlist);

      let audioStatus = [];
        commentlist.forEach(comment => {
        comment.createTime = util.formatTime((comment.createTime), 'yyyy/MM/dd')
        audioStatus.push(constant.UNPLAYING)
      })

      this.setData({
          commentlist,
          audioStatus
        })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })

  },
  onPullDownRefresh: function () {
    this.setData({
      pagenum: 0
    })
    this.getcommentlist(res => {
      wx.stopPullDownRefresh()
    })
  },
  startPlay(e) {
    let that = this
    this.setData({
      startPlay: true,
    })
    console.log(e.currentTarget)
    clearInterval(timer)
    let index = e.currentTarget.dataset.index;
   
    let n = parseInt(e.currentTarget.dataset.item.voiceTime)
    timer = setInterval(function () {
      n--
      let s = parseInt(n % 60)

      let audioStatus = [];
      for (let i = 0; i < that.data.audioStatus.length; i++) {
        if (i === index && n>0) {
          audioStatus.push(constant.PLAYING);
        } else {
          audioStatus.push(constant.UNPLAYING);
        }
      }
      that.setData({
        audioStatus: audioStatus
      })

      if (n == 0) {
        clearInterval(timer)
        that.setData({
          startPlay: false
        })
      }
    }, 1000)
    let voice = e.currentTarget.dataset.item.voice
    this.playRecord(voice)
  },
  // 播放录音
  playRecord(voice) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true;
    innerAudioContext.src = voice;
    innerAudioContext.onPlay(() => {
      console.log('start play')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
    })
  },
  skipToHome() {
    wx.reLaunch({
      url: '../home/home',
    })
  },

})