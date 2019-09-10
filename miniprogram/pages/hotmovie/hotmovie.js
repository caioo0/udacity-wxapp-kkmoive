const db = require('../../utils/db')
const util = require('../../utils/util')
Page({
  data: {
    pagenum: 0,
    movieList: []
  },
  onLoad: function (options) {
    this.getMovieList()
    wx.showLoading({
      title: '',
    })
  },
  onReachBottom: function () {
    let pagenum = this.data.pagenum + 1
    this.setData({
      pagenum: pagenum
    })
    this.getMovieList()
  },
  getMovieList() {
    let page = this.data.pagenum
    db.getHotMovieList(page).then(res => {
    wx.hideLoading()
    let curmovieList = res.result.data
    let originmovieList = this.data.movieList;
    let movieList = originmovieList.concat(curmovieList);
    if (curmovieList.length<1) {
      wx.showToast({
        title: '没有更多电影了。'
      });
    }else
    {
      this.setData({
        movieList
      })
    }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      pagenum:0
    })
    this.getMovieList(res => {
      wx.stopPullDownRefresh()
    })
  }
})