// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const hasmyFavorite = await db.collection('myFavorites').where({
    user: user,
    commentid: event.id
  }).count()

  const comment = await db.collection('movieComments').where({
    _id: event.id
  }).get()

  const commentdetail = comment
  commentdetail.myfavorite = hasmyFavorite.total

  return commentdetail
}