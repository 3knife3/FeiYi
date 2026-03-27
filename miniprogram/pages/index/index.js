// index.js
const app = getApp();

Page({
  data: {
    swiperList: [
      { id: '1', imgUrl: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner1.png' },
      { id: '2', imgUrl: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner2.png' },
      { id: '3', imgUrl: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner3.png' },
      { id: '4', imgUrl: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner4.png' },
      { id: '5', imgUrl: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner5.png' },
      { id: '6', imgUrl: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner6.png' },
      { id: '7', imgUrl: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner7.png' }
    ],
    importantNotice: '今日打卡规则调整：需完成定位打卡才有效',
    latestNotice: '逢简水乡非遗小程序正在部署中...',
    functionList: [
      { name: '科普', icon: '/images/function/science.png' },
      { name: '美食', icon: '/images/function/food.png' },
      { name: '娱乐', icon: '/images/function/entertainment.png' },
      { name: '路线推荐', icon: '/images/function/route.png' },
      { name: '打卡', icon: '/images/function/checkin.png' }
    ],
    points: [],
    userScore: 0,
    showPopup: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.setData({
      userScore: app.globalData.score
    })
  },

  loadData() {
    this.setData({
      points: app.globalData.checkPoints,
      userScore: app.globalData.score
    })
  },

  openCheckPopup() {
    this.setData({
      points: app.globalData.checkPoints,
      userScore: app.globalData.score
    });
    this.setData({ showPopup: true });
  },

  closePopup() {
    this.setData({ showPopup: false });
  },

  navigateToPage(e) {
    const name = e.currentTarget.dataset.name;
    const app = getApp();
    switch (name) {
      case '科普':
        wx.switchTab({ url: '/pages/science/science' });
        break;
      case '美食':
        app.globalData.scienceTab = 'food';
        wx.switchTab({ url: '/pages/science/science' })
        break;
      case '娱乐':
        app.globalData.scienceTab = 'entertainment';
        wx.switchTab({ url: '/pages/science/science' })
        break;
      case '路线推荐':
        wx.navigateTo({ url: '/pages/route/route' });
        break;
      case '打卡':
        this.openCheckPopup();
        break;
      default:
        wx.showToast({ title: '功能暂未开放', icon: 'none' });
    }
  },

  previewMap() {
    // 直接用你的云存储路径
    const cloudPath = "cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/map/new_map.png";
  
    // 预览图片（微信自动处理云路径）
    wx.previewImage({
      current: cloudPath,
      urls: [cloudPath],
      fail: (err) => {
        console.error("预览失败", err);
        wx.showToast({ title: "预览失败", icon: "none" });
      }
    });
  },

  // 打卡
  checkPoint(e) {
    const index = e.currentTarget.dataset.index;
    let points = this.data.points;  
    const point = points[index];

    if (point.checked) {
      wx.showToast({ title: '已打卡', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '定位中...' });

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const nowLat = res.latitude;
        const nowLng = res.longitude;
        const distance = this.getDistance(point.lat, point.lng, nowLat, nowLng);

        if (distance <= 100) {
          points[index].checked = true;
          const newScore = app.globalData.score + point.score;

          // 全局更新
          app.globalData.checkPoints = points;
          app.globalData.score = newScore;

          // 保存用户积分
          const user = wx.getStorageSync('userInfo') || {}; 
          user.score = newScore;
          wx.setStorageSync('userInfo', user);

          this.setData({ points, userScore: newScore });
          wx.hideLoading();
          wx.showToast({ title: `打卡成功+${point.score}分`, icon: 'success' });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: `超出打卡范围！离${point.name}还有${distance}米`,
            icon: 'none',
            duration: 3000
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '定位失败', icon: 'none' });
      }
    });
  },

  getDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = (lng1 - lng2) * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378137;
    return Math.round(s);
  }
})