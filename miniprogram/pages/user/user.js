const db = require('../../utils/db')
const util = require('../../utils/util')
Page({
  data: {
    movieList: [],
    selectNum: '0', // tab选中值
    userInfo: null
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '玩命加载中...',
    })
    this.getMyCollection()
  
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
   onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo
    })
  },
  getMyCollection(callback) { // 查收藏
    db.getmyFavorites().then(res => {
      wx.hideLoading()
      let movieList = res.result.data
      this.setData({
        movieList
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },
  getMyRelease(callback) { // 查发布
    db.getMovieCommentByUser().then(res => {
      wx.hideLoading()
      let movieList = res.result.data
      this.setData({
        movieList
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    if (this.data.selectNum == 0) {
      this.getMyCollection(res => {
        wx.stopPullDownRefresh()
      })
    } else if (this.data.selectNum == 1) {
      this.getMyRelease(res => {
        wx.stopPullDownRefresh()
      })
    }
  },
  // tab切换
  selectTab(e) {
    if (Object.keys(e.target.dataset).length === 0) {
      return false // 如果为空,返回false
    }
    let selectNum = e.target.dataset.num
    this.setData({
      selectNum
    })
    if (selectNum == 0) { // 已收藏
      this.setData({
        movieList: []
      })
      this.getMyCollection()
      wx.showLoading({
        title: '',
      })
    } else if (selectNum == 1) { // 已发布
      this.setData({
        movieList: []
      })
      this.getMyRelease()
      wx.showLoading({
        title: '',
      })
    }
  },
  // 回到首页
  skipToHome() {
    wx.reLaunch({
      url: '../home/home'
    })
  },


})