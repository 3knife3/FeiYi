const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { openid, changeScore } = event

  try {
    const userRes = await db.collection('users').where({ OPENID: openid }).get()
    if (userRes.data.length === 0) return { code: -1 }

    const user = userRes.data[0]
    const newScore = Math.max(0, user.score + changeScore)

    await db.collection('users').doc(user._id).update({
      data: { score: newScore }
    })

    return { code: 0, newScore }
  } catch (e) {
    return { code: -1 }
  }
}