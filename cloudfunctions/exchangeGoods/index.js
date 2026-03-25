const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { openid, goodsId, goodsName, costScore } = event

  try {
    const userRes = await db.collection('users').where({ OPENID: openid }).get()
    const user = userRes.data[0]
    if (user.score < costScore) return { code: -1, msg: '积分不足' }

    const newScore = user.score - costScore
    await db.collection('users').doc(user._id).update({
      data: { score: newScore }
    })

    await db.collection('orders').add({
      data: {
        openid, goodsId, goodsName, costScore,
        createTime: new Date()
      }
    })

    return { code: 0, newScore }
  } catch (e) {
    return { code: -1 }
  }
}