const db = require('../../utils/db')
const util = require('../../utils/util')
Page({
  data: {
    movie: [],
    comment: [],
    hascomment:false
  },
  onLoad() {
    this.getRandomComment() 
  },
  onPullDownRefresh: function () {
   
    this.getRandomComment(res => {
      wx.stopPullDownRefresh()
    })
  },
  getRandomComment() { //获取随机电影和评论，没有评论仅显示电影，无电影资料显示无资料
    wx.showLoading({
      title: 'Loading...',
    })
    db.getRandomComment().then(res => {
        wx.hideLoading()
      let movie = res.result.movieInfo
      let comment=''
      let hascomment = false
      if(res.result.data.length >0) {
        comment = res.result.data[0]
        hascomment  = true
      }
      this.setData({
        hascomment: hascomment,
        movie,
        comment
        })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },
   // 跳转影评详情
  goToCommentDetail(event) {
    let commentId = event.currentTarget.id
    wx.navigateTo({
      url: '../commentdetail/commentdetail?commentId=' + commentId,
    })
  },
  // 跳转电影详情
  goToMovieinfo(event) {
    let movieId = this.data.movie._id
    wx.navigateTo({
      url: '../moviedetail/moviedetail?movieId=' + movieId,
    })
  },
  // 跳转我的
  goToMe(event) {
    wx.navigateTo({
      url: '../user/user',
    })
  },
  // 跳转热门
  goTohot(event) {
    wx.navigateTo({
      url: '../hotmovie/hotmovie',
    })
  },
})