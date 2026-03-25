// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-2gp5ez590981c671' }) // 使用当前云环境

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('goods').add({
      data: {
        imageUrl: event.imageUrl,
        uploadTime: db.serverDate()
      }
    })
  } catch (e) {
    console.error(e)
    return e
  }
}