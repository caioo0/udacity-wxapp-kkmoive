// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const hascomment = await db.collection('movieComments').where({
    user: user,
    movieId: event.id
  }).count()

  const movie = await db.collection('movies').where({
    _id: event.id
  }).get()

  const res = movie
  res.hascomment = hascomment.total
  return res
}