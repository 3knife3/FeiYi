// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请升级微信基础库以支持云开发');
    } else {
      wx.cloud.init({
        env: 'cloud1-2gp5ez590981c671',
        traceUser: true,
      });
    }
  },

  globalData: {
    userInfo: null,
    scienceTab: 'scenery',
    // 打卡 9 个点位（所有页面共用）
    checkPoints: [
      { id: 1, name: "和之梁公祠", lat: 23.02882, lng: 113.14278, checked: false, score: 10 },
      { id: 2, name: "进士牌坊", lat: 23.02900, lng: 113.14300, checked: false, score: 10 },
      { id: 3, name: "觉妙净院", lat: 23.02950, lng: 113.14400, checked: false, score: 10 },
      { id: 4, name: "明远桥", lat: 23.03000, lng: 113.14500, checked: false, score: 10 },
      { id: 5, name: "宋参政李公祠", lat: 23.03050, lng: 113.14600, checked: false, score: 10 },
      { id: 6, name: "刘氏大宗祠", lat: 23.03100, lng: 113.14700, checked: false, score: 10 },
      { id: 7, name: "金鳌桥", lat: 23.03150, lng: 113.14800, checked: false, score: 10 },
      { id: 8, name: "郭氏宗祠", lat: 23.03200, lng: 113.14900, checked: false, score: 10 },
      { id: 9, name: "巨济桥", lat: 23.03250, lng: 113.15000, checked: false, score: 10 },
    ],
    score: 0,
    userInfo: null
  },
  // 刷新积分
  refreshScore() {
    const user = wx.getStorageSync('userInfo');
    if (user) {
      this.globalData.score = user.score || 0;
    }
  },

  // 保存打卡记录
  saveCheckData() {
    wx.setStorageSync('checkPoints', this.globalData.checkPoints);
    wx.setStorageSync('totalScore', this.globalData.totalScore);
  },

  // 读取打卡记录
  loadCheckData() {
    const points = wx.getStorageSync('checkPoints');
    const score = wx.getStorageSync('totalScore');
    if (points) this.globalData.checkPoints = points;
    if (score || score === 0) this.globalData.totalScore = score;
  }
})