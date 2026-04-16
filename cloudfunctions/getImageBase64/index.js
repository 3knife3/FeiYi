// cloudfunctions/getImageBase64/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { fileID } = event
  try {
    // 从云存储下载文件并转成 Base64
    const res = await cloud.downloadFile({ fileID })
    const base64 = res.fileContent.toString('base64')
    return {
      code: 0,
      data: `data:image/png;base64,${base64}`
    }
  } catch (err) {
    return { code: -1, err }
  }
}