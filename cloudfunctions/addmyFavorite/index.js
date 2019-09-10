// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID

  await db.collection('myFavorites').add({
    data: {
      user,
      commentid: event.commentId,
      name: event.name,
      title: event.title,
      headshort: event.headshort,
      content: event.content,
      image: event.image,
      createTime: +new Date()
    },
  })

  return {}
}

