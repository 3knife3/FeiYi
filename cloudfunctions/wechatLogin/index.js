// 云函数：wechatLogin
// 功能：通过 code 获取 openid，实现唯一用户登录
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口
exports.main = async (event, context) => {
  const { code, name, avatar } = event
  const wxContext = cloud.getWXContext()

  // 获取用户唯一 openid
  const OPENID = wxContext.OPENID

  // 数据库
  const db = cloud.database()
  const userCollection = db.collection('users')

  try {
    // 按 openid 查询用户（唯一！）
    const userRes = await userCollection.where({ OPENID }).get()

    let userInfo
    if (userRes.data.length > 0) {
      // 已有账号 → 直接登录
      userInfo = userRes.data[0]
    } else {
      // 新用户 → 创建账号（用 openid 唯一标记）
      const addRes = await userCollection.add({
        data: {
          openid: OPENID,
          name: name,
          avatar: avatar,
          score: 0,        // 积分
          createTime: new Date()
        }
      })
      // 查询刚创建的用户信息
      const newUser = await userCollection.doc(addRes._id).get()
      userInfo = newUser.data
    }

    return {
      code: 0,
      message: "登录成功",
      userInfo: userInfo
    }
  } catch (e) {
    return {
      code: -1,
      message: "登录失败",
      error: e
    }
  }
}