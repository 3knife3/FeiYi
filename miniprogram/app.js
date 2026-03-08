// app.js
App({
    onLaunch() {
      // 初始化云开发（替换成你的云环境ID！）
      wx.cloud.init({
        env: "你的云开发环境ID", // 比如：env-xxxxxxx
        traceUser: true // 跟踪用户行为，可选
      })
    }
  })