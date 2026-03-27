// pages/shop/shop.js
const app = getApp();

Page({
  data: {
    userScore: 0,
    points: [],
    showPopup: false,
    notice: "积分商城正在部署中...",
    showSign: false,
    showShare: false,
    showCheckIn: false,
    selectedCost: 0,
    selectedName: '',
    selectedId: 0,
    showModal: false,
    imageUrl: '',
    list: [
      { id: 1, name: '保温杯', cost: 80, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/goods/thermal_mug.png' },
      { id: 2, name: '数据线', cost: 150, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/goods/usb_table.png' },
      { id: 3, name: '小风扇', cost: 200, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/goods/small_fan.png' },
      { id: 4, name: '充电宝', cost: 300, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/goods/protable_charger.png' },
      { id: 5, name: '耳机', cost: 500, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/goods/earphone.png' },
      { id: 6, name: '蓝牙音箱', cost: 800, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/goods/bluetooth_speaker.png' }
    ],
    rule: "兑换规则：积分可兑换对应商品，兑换后将在3个工作日内发货"
  },

  onLoad() {
    this.setData({
      points: app.globalData.checkPoints,
      userScore: app.globalData.score
    })
  },

  onShow() {
    this.setData({
      userScore: app.globalData.score
    })
  },

  // 签到
  showSign() {
    if (!this.checkLogin()) return;
    this.setData({ showSign: true });
  },
  closeSignPopup() {
    this.setData({ showSign: false });
  },
  doSign() {
    this.updateScore(50)
    wx.showToast({ title: '签到成功 +50', icon: 'success' })
    this.setData({ showSign: false })
  },

  // 分享
  showShare() {
    if (!this.checkLogin()) return;
    this.setData({ showShare: true });
  },
  onShareAppMessage() {
    this.updateScore(30);
    wx.showToast({ title: '分享成功 +30', icon: 'success' });
    this.setData({ showShare: false });
    return {
      title: '快来打卡得积分',
      path: '/pages/index/index' // 分享后跳转的页面
    };
  },

  closeSharePopup() {
    this.setData({ showShare: false });
  },

  // 打卡弹窗
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

  // 打卡逻辑
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

  // 距离计算
  getDistance(lat1, lng1, lat2, lng2) {
    var r = Math.PI / 180
    var a = lat1 * r - lat2 * r
    var b = lng1 * r - lng2 * r
    return Math.round(6378137 * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.pow(Math.sin(b / 2), 2))))
  },
  updateScore(add) {
    const newScore = app.globalData.score + add;
    app.globalData.score = newScore;
    // 兼容空 userInfo 的情况
    const user = wx.getStorageSync('userInfo') || {};
    user.score = newScore;
    wx.setStorageSync('userInfo', user);
    this.setData({ userScore: newScore });
  },
  // 兑换商品
  exchangeGoods(e) {
    if (!this.checkLogin()) return;

    const { id, name, cost } = e.currentTarget.dataset;
    const { userScore } = this.data;

    // 积分不足
    if (userScore < cost) {
      wx.showToast({
        title: '积分不足',
        icon: 'error'
      });
      return;
    }

    // 确认兑换
    wx.showModal({
      title: '确认兑换',
      content: `确定要兑换【${name}】吗？\n消耗：${cost} 积分`,
      success: (res) => {
        if (res.confirm) {
          // 扣除积分
          this.updateScore(-cost);

          wx.showToast({
            title: '兑换成功！',
            icon: 'success'
          });
        }
      }
    });
  },
  // 工具
  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showModal({ title: '请先登录', showCancel: false });
      return false;
    }
    this.setData({ userInfo });
    return true;
  },
  goDetail() {
    wx.navigateTo({ url: '../order/order' });
  },
});
