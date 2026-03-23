const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { avatar, name } = event
  const { OPENID } = cloud.getWXContext()

  try {
    // 查询用户是否已存在
    const userRes = await db.collection('users').where({ OPENID }).get()

    if (userRes.data.length > 0) {
      // 更新
      await db.collection('users').doc(userRes.data[0]._id).update({
        data: { avatar, name, updateTime: new Date() }
      })
    } else {
      // 新增
      await db.collection('users').add({
        data: { OPENID, avatar, name, score: 0, createTime: new Date() }
      })
    }

    return {
      code: 0,
      userInfo: { avatar, name, score: 0 }
    }
  } catch (e) {
    return { code: -1 }
  }
}