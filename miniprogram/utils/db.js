const util = require('./util')
const db = wx.cloud.database({
  env: 'wushanbooks-j1j9s'
})

module.exports = {

  getRandomComment() // 首页- 随机电影和影评
  {
    return wx.cloud.callFunction({
      name: 'getRandomComment'
    })
  },
  getMovieById(id) {
    return wx.cloud.callFunction({
      name: 'getMovieById',
      data:
      {
        id
      }
    })
  },
  getHotMovieList(page) {   // 热门 - 获取热门电影列表  - 分页显示 
    return wx.cloud.callFunction({
      name: 'movieList',
      data:
      {
        page
      }
    })
  }
  ,
  getMovieComments(page,movieId) {      // 获取某一部电影的影评
    console.log(page)
    return wx.cloud.callFunction({
      name: 'movieComments',
      data:
      {
        movieId:movieId,
        page: page
      }
    })
  },
  getMovieCommentById(id) {    //根据ID获取影评
    return wx.cloud.callFunction({
      name: 'getCommentById',
      data:
      {
        id
      }
    })
  },
  getMovieCommentByUser() {   //我的影评列表
    return wx.cloud.callFunction({
      name: 'getMovieCommentByUser'
    })
  },
  getmyFavorites() {     //获取我的收藏列表 
    return wx.cloud.callFunction({
      name: 'myFavorites'
    })
  },
  addcomment(data) {
    return wx.cloud.callFunction({
          name: 'addComment',
          data,
        })
    },
  addmyFavorite(data) {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'addmyFavorite',
          data,
        })
      }).catch(() => {
        wx.showToast({
          icon: 'none',
          title: 'Please Login First'
        })
        return {}
      })
  },
  uploadVoice(vpath) {  //上传录音文件
   return wx.cloud.uploadFile({
      cloudPath: `sounds/${util.getId()}.mp3`,
      filePath: vpath,
    })

  },
}
