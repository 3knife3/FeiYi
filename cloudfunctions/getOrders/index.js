// const cloud = require('wx-server-sdk')
// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
// const db = cloud.database()

// exports.main = async (event) => {
//   const { OPENID } = event
//   const res = await db.collection('orders').where({ OPENID }).orderBy('createTime', 'desc').get()
//   return { code: 0, data: res.data }
// }
// cloudfunctions/getOrders/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  try {
    // 👇 最关键：如果没有 OPENID，直接返回空数组，绝不报错！
    const OPENID = event.OPENID || ''
    if (!OPENID) {
      return { code: 0, data: [] }
    }

    // 正常查询
    const res = await db.collection('orders')
      .where({ OPENID }) // 数据库字段是大写 OPENID
      .orderBy('createTime', 'desc')
      .get()

    return { code: 0, data: res.data }
  } catch (err) {
    // 👇 出错也返回空，绝不崩！
    return { code: 0, data: [] }
  }
}