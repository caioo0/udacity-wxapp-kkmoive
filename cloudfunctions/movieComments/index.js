// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let page = event.page * 5
  let movieId = event.movieId
  return db.collection('movieComments').where({
    movieId: movieId
  }).skip(page).limit(5).orderBy('createTime', 'desc').get()

}