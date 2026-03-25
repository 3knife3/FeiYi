const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { openid } = event
  const res = await db.collection('orders').where({ openid }).orderBy('createTime', 'desc').get()
  return { code: 0, data: res.data }
}