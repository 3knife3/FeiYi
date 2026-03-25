// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请升级微信基础库以支持云开发');
    } else {
      wx.cloud.init({
        env: 'cloud1-2gp5ez590981c671', // 替换为自己的云环境ID
        traceUser: true,
      });
    }
  }
})