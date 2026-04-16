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
    // 读取所有用户的数据
    const userStore = wx.getStorageSync('userStore') || {}
    this.globalData.userStore = userStore
    // 自动加载当前登录用户
    this.loadUserData()
  },


  globalData: {
    userInfo: null,
    scienceTab: 'scenery',
    // 打卡 9 个点位（所有页面共用）
    checkPoints: [
      { id: 1, name: "和之梁公祠", lat: 22.815602, lng: 113.155547, checked: false, score: 30 },
      { id: 2, name: "进士牌坊", lat: 22.815528, lng: 113.156131, checked: false, score: 30 },
      { id: 3, name: "觉妙净院", lat: 22.814319, lng: 113.157435, checked: false, score: 30 },
      { id: 4, name: "明远桥", lat: 22.812491, lng: 113.157329, checked: false, score: 30 },
      { id: 5, name: "宋参政李公祠", lat: 22.812501, lng: 113.156217, checked: false, score: 30 },
      { id: 6, name: "刘氏大宗祠", lat: 22.810238, lng: 113.155135, checked: false, score: 30 },
      { id: 7, name: "金鳌桥", lat: 22.811480, lng: 113.154334, checked: false, score: 30 },
      { id: 8, name: "附近", lat: 23.148560, lng: 113.031760, checked: false, score: 100 },
      { id: 9, name: "待定", lat: 0, lng: 0, checked: false, score: 10 }
    ],
    score: 0,
    userInfo: null,
    orderList: [],
    userStore: {}
  },

  getUserKey() {
    const user = wx.getStorageSync('userInfo')
    if (!user || !user.name) return "___guest"
    return "___user_" + user.name
  },

  loadUserData() {
    const key = this.getUserKey()
    const store = this.globalData.userStore

    // 如果这个用户已经存在 → 用原来的分数
    if (store[key]) {
      this.globalData.score = store[key].score
      this.globalData.orderList = store[key].orderList
    } else {
      // 真正的新用户 → 才给 200
      this.globalData.score = 200
      this.globalData.orderList = []
    }
  },

  saveUserData() {
    const key = this.getUserKey()
    this.globalData.userStore[key] = {
      score: this.globalData.score,
      orderList: this.globalData.orderList
    }
    wx.setStorageSync('userStore', this.globalData.userStore)
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