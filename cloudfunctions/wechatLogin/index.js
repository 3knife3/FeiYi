// cloudfunctions/wechatLogin/index.js
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  console.log("=== 云函数开始执行 ===")
  console.log("收到的event参数：", event)
  console.log("当前环境：", cloud.DYNAMIC_CURRENT_ENV)

  try {
    const { avatar, name } = event
    const { OPENID } = cloud.getWXContext()
    console.log("获取到的OPENID：", OPENID)

    if (!OPENID) {
      console.error("获取OPENID失败")
      return { code: -1, msg: '获取用户标识失败' }
    }
    if (!avatar || !name) {
      console.error("信息不完整：avatar=", avatar, "name=", name)
      return { code: -1, msg: '信息不完整' }
    }

    // 查询用户是否存在
    console.log("开始查询用户是否存在...")
    const find = await db.collection('users').where({
      OPENID: OPENID
    }).get()
    console.log("查询结果：", find)

    let userInfo = null

    if (find.data.length > 0) {
      console.log("用户已存在，执行更新操作")
      await db.collection('users').doc(find.data[0]._id).update({
        data: {
          avatar,
          name,
          updateTime: new Date()
        }
      })
      userInfo = {
        avatar,
        name,
        score: find.data[0].score || 0
      }
    } else {
      console.log("用户不存在，执行新增操作")
      const addRes = await db.collection('users').add({
        data: {
          OPENID,
          avatar,
          name,
          score: 0,
          createTime: new Date()
        }
      })
      console.log("新增用户成功，返回ID：", addRes)
      userInfo = {
        avatar,
        name,
        score: 0
      }
    }

    console.log("=== 云函数执行成功，返回数据：", { code: 0, userInfo })
    return {
      code: 0,
      userInfo: userInfo,
      msg: '登录成功'
    }

  } catch (err) {
    console.error("=== 云函数执行异常 ===")
    console.error("错误信息：", err)
    console.error("错误堆栈：", err.stack)
    return {
      code: -1,
      msg: '服务器错误：' + err.message
    }
  }
}