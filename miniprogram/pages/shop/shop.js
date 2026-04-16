const app = getApp();

Page({
  data: {
    userScore: 0,
    points: [],
    showPopup: false,
    notice: "全新商品兑换券正式推出,新用户赠送200积分!",
    showSign: false,
    showShare: false,
    showCheckIn: false,
    selectedCost: 0,
    selectedName: '',
    selectedId: 0,
    showModal: false,
    imageUrl: '',
    list: [
      { id: 1, name: '1元兑换券', cost: 100, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/exchange voucher/1yuan.png' },
      { id: 2, name: '2元兑换券', cost: 200, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/exchange voucher/2yuan.png' },
      { id: 3, name: '3元兑换券', cost: 300, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/exchange voucher/3yuan.png' },
      { id: 4, name: '5元兑换券', cost: 500, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/exchange voucher/5yuan.png' },
      { id: 5, name: '8元兑换券', cost: 800, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/exchange voucher/8yuan.png' },
      { id: 6, name: '10元兑换券', cost: 1000, img: 'cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/exchange voucher/10yuan.png' }
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
          app.saveUserData()
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
  // 兑换商品
  exchangeGoods(e) {
    if (!this.checkLogin()) return;
  
    const { id, name, cost } = e.currentTarget.dataset;
    const { userScore } = this.data;
  
    if (userScore < cost) {
      wx.showToast({ title: '积分不足', icon: 'error' });
      return;
    }
  
    wx.showModal({
      title: '确认兑换',
      content: `确定要兑换【${name}】吗？\n消耗：${cost} 积分`,
      success: (res) => {
        if (res.confirm) {
          this.updateScore(-cost);

          let now = new Date();
          let year = now.getFullYear();
          let month = String(now.getMonth() + 1).padStart(2, '0');
          let day = String(now.getDate()).padStart(2, '0');
          let hour = String(now.getHours()).padStart(2, '0');
          let minute = String(now.getMinutes()).padStart(2, '0');
          let createTime = `${year}.${month}.${day} ${hour}:${minute}`;
  
          let newRecord = {
            goodsName: name,
            costScore: cost,
            createTime: createTime
          };
  
          // 👇 拿当前登录的用户名做唯一标识
          const userInfo = wx.getStorageSync('userInfo');
          const key = "orderList_" + (userInfo.name || "guest");
  
          // 读取当前用户的订单
          let orderList = wx.getStorageSync(key) || [];
          orderList.unshift(newRecord);
  
          // 保存
          wx.setStorageSync(key, orderList);
          app.globalData.orderList = orderList;
          // ================================
  
          wx.showToast({ title: '兑换成功！', icon: 'success' });
          // 兑换成功最后加一句
          app.saveUserData()
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
  }
});