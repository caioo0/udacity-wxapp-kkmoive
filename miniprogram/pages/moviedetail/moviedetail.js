const db = require('../../utils/db')
const util = require('../../utils/util')
Page({
  data: {
    movie: {},
    movieId:'',
    actionSheetHidden: true,
    actionSheetItems: ['文字', '音频']
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
    })
    this.getMovieById(options.movieId)
  },
  // 根据ID获取电影详情
  getMovieById(id) {
    wx.showLoading({
      title: 'Loading...',
    })
    db.getMovieById(id).then(res => {
      wx.hideLoading()
      console.log(res.result)
      let movie = res.result.data[0]
      let movieDetail = {
        image: movie.image,
        title: movie.title
      }
      wx.setStorageSync('movieDetail', movieDetail)
      this.setData({
        movieId:id,
        movie
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },
  // 底部弹出框
  actionSheetTap(event) {
    // this.setData({
    //   actionSheetHidden: !this.data.actionSheetHidden
    // })
    console.log(event.currentTarget)
    let movieId = this.data.movie._id;
    let commentType = "";
    wx.showActionSheet({
      itemList: this.data.actionSheetItems,
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
  // 跳转影评列表页
  skipToComment() {
    wx.navigateTo({
      url: '../commentlist/commentlist?movieId=' + this.data.movieId,
    })
  },
})