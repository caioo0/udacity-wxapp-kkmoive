
const db = require('../../utils/db')
const util = require('../../utils/util')

let timer = null;
const recorderManager = wx.getRecorderManager()
const backgroundAudio = wx.getBackgroundAudioManager()
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    image: '',
    title: '',
    headshort: '',
    name: '',
    content: '',
    voice: '',
    startPlay: false,
    radioTimer: '',
    isText: true,
    movieId: '',
    userInfo: null
  },
  onLoad: function (options) {
    this.getMovieById(options); 
  },
  onShow() {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    console.log(util.isAuthenticated())
    }).catch(err => {
      console.log('Not Authenticated yet');
    })
  },
  onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo
    })
  },
  // 根据ID获取电影详情
  getMovieById(options) {
    wx.showLoading({
      title: 'Loading...',
    })
    var self = this;
    wx.getStorage({
      key: 'tempFilePath',
      success: function (res) {
        self.setData({
          voice: res.data
        })
      }
    })
    let id = options.movieId;
    console.log(options)

    db.getMovieById(id).then(res => {
      wx.hideLoading()
      let movie = res.result.data[0]
      if (options.selectTxt == 'true') {
        this.setData({
          image: movie.image,
          title: movie.title,
          isText: true,
          content: options.content,
          movieId: id
        })
      } else {
        this.setData({
          image: movie.image,
          title: movie.title,
          isText: false,
          radioTimer: options.radioTimer,
          movieId: id
        })
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },
  saveToComment() {
    wx.showLoading({
      title: 'Loading...',
    })
    var self = this;
    if (this.data.isText) {
      db.addcomment({
        name: this.data.userInfo.nickName,
        title: this.data.title,
        headshort: this.data.userInfo.avatarUrl,
        content: this.data.content,
        voice: '',
        voiceTime:'',
        image: this.data.image,
        createTime: +new Date(),
        movieId: this.data.movieId
      }).then(result => {
        wx.hideLoading()
        const data = result.result
        if (data) {
          wx.showToast({
            title: '发布成功'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../commentlist/commentlist?movieId=' + this.data.movieId,
            })
          }, 1500)
        }
      }).catch(err => {
        console.error(err)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: 'Failed'
        })
      })

    } else {
      this.uploadVoice(voice => {
        console.log("voice:" + self.data.radioTimer)
        db.addcomment({
          name: self.data.userInfo.nickName,
          title: self.data.title,
          headshort: self.data.userInfo.avatarUrl,
          content: self.data.content,
          image: self.data.image,
          createTime: +new Date(),
          voice:voice.fileID,
          voiceTime: self.data.radioTimer,
          movieId: self.data.movieId
        }) .then(result => {
            wx.hideLoading()
            const data = result.result
            if (data) {
              wx.showToast({
                title: '发布成功！'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: '../commentlist/commentlist?movieId=' + this.data.movieId,
                })
              }, 1500)
            }
          }).catch(err => {
            console.error(err)
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: 'Failed'
            })
          })
      })
    }
  },
  uploadVoice(callback) {
    let tempFilePath = this.data.voice;
    db.uploadVoice(tempFilePath).then(result => {
      console.log(result)
      callback && callback(result)
    }).catch(err => {
      console.log('err', err)
    })
  },
    startPlay() {
  
    let that = this
    this.setData({
      startPlay: true,
    })
    clearInterval(timer)
    let n = parseInt(that.data.radioTimer)
    timer = setInterval(function () {
      n--
      let s = parseInt(n % 60)
      if (n == 0) {
        clearInterval(timer)
        that.setData({
          startPlay: false
        })
      }
    }, 1000)
    this.playRecord()
  },
  // 播放录音
  playRecord() {
    //innerAudioContext.autoplay = true;
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true;
    innerAudioContext.src = this.data.voice;
    innerAudioContext.onPlay(() => {
      console.log(innerAudioContext.src)
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
    })
  },
  backToComment() {
    wx.navigateBack()
  },
})