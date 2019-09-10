const db = require('../../utils/db')
const util = require('../../utils/util')
let timer = null;
const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    comment: {},
    addToFavorite: false,
    startPlay: false,
    playTime: 0,
    voice: '',
    userInfo: null
  },
  onLoad: function (options) {
    this.getComment(options.commentId)
    wx.showLoading({
      title: '',
    })
  },
  onShow() {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('Not Authenticated yet');
    })
  },
  getComment(id) {
    db.getMovieCommentById(id).then(res => {
      wx.hideLoading()
      let comment = res.result.data[0]
      let addToFavorite = false
      if(res.result.myfavorite>0)
      {
        addToFavorite = true
      }
      this.setData({
        comment,
        playTime:comment.voiceTime+"s",
        addToFavorite: addToFavorite
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },
  startPlay() {
   
    let that = this
    that.setData({
      startPlay: true,
    })
    clearInterval(timer)
    let n = parseInt(that.data.comment.voiceTime)
    timer = setInterval(function () {
      n--
      let s = parseInt(n % 60)
  
      that.setData({
        playTime: s+"'s"
      })
      if (n == 0) {
        clearInterval(timer)
        
        that.setData({
          startPlay: false,
          playTime: that.data.comment.voiceTime + "s",
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
    innerAudioContext.src = this.data.comment.voice;
    console.log("again")
    console.log(innerAudioContext.src)
    innerAudioContext.onPlay(() => {
      console.log('start play')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
    })
  },
  // 底部弹出框
  actionSheetTap(event) {
    // this.setData({
    //   actionSheetHidden: !this.data.actionSheetHidden
    // })
    console.log(event.currentTarget)
    let movieId = this.data.comment.movieId;
    let commentType = this.data.comment.type;
    let movieDetail = {
      image: this.data.comment.image,
      title: this.data.comment.title
    }
    wx.setStorageSync('movieDetail', movieDetail)
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: res => {
        if (res.tapIndex === 0) {
          // 文字
          commentType = 'text'
        } else {
          // 音频
          commentType = 'voice'
        }
        wx.navigateTo({
          url: '../add-comment/add-comment?selectType=' + commentType + "&movieId=" + movieId
        })
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  // 收藏影评
  skipToComment() {
    if (!this.data.addToFavorite) { // 未收藏
      this.setData({
        addToFavorite: true
      })
      wx.showLoading({
        title: '处理中...'
      })
      db.addmyFavorite({
        commentId: this.data.comment._id,
        name: this.data.comment.name,
        title: this.data.comment.title,
        headshort: this.data.comment.headshort,
        content: this.data.comment.content,
        image: this.data.comment.image,
        createTime: +new Date()
      }).then(result => {
        wx.hideLoading()
        const data = result.result
        if (data) {
          wx.showToast({
            title: '收藏成功'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '../user/user',
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
    }
  },
  skipTomovie(event) {
    wx.navigateTo({
      url: '../moviedetail/moviedetail?movieId=' + this.data.comment.movieId,
    })
  },
  
})