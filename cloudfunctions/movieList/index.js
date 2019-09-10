// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let page = event.page*10
  return db.collection('movies').skip(page).limit(10) 
    .get() 
}