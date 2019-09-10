// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
 
 
  const moviescount = await db.collection('movies').count()
  const keys = Math.floor(Math.random() * moviescount.total)//获取随机的电影信息
  const topmovie = await db.collection('movies').skip(keys).limit(1).get()
  const movieId = topmovie.data[0]._id
  const comment = await db.collection('movieComments').where({
    movieId: movieId
  }).get()
  
  const retresult = comment
  retresult.movieInfo = topmovie.data[0]
  retresult.total = moviescount.total
  retresult.movieId = movieId
  return retresult

}