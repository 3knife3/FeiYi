// app.js
App({
    onLaunch() {
      wx.cloud.init({
        env: "cloud1-2gp5ez590981c671", 
        traceUser: true
      })
    },
    globalData: {
      scienceTab: "scenery",
      isLogin: false,
      userInfo: null
    }
  })