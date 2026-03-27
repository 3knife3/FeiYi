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
    selecetedCost: 0,
    selecetedName: '',
    selecetedId: 0,
    showModal: false,
    imageUrl: '',
    list: [
      { id: 1, name: '保温杯', cost: 80, img: '/images/goods/thermal_mug.png' },
      { id: 2, name: '数据线', cost: 150, img: '/images/goods/usb_table.png' },
      { id: 3, name: '小风扇', cost: 200, img: '/images/goods/small_fan.png' },
      { id: 4, name: '充电宝', cost: 300, img: '/images/goods/protable_charger.png' },
      { id: 5, name: '耳机', cost: 500, img: '/images/goods/earphone.png' },
      { id: 6, name: '蓝牙音箱', cost: 800, img: '/images/goods/bluetooth_speaker.png' }
    ],
    rule:"兑换规则：积分可兑换对应商品，兑换后将在3个工作日内发货"
  },

  // 签到弹窗 
  showSign() {this.setData({showSign: true})},
  doSign() {
    this.updateScore(50)
    wx.showToast({title:'签到成功 +50', icon:'success'})
    this.setData({ showSign: false })
  },
  closeSignPopup() {
    this.setData({ showSign: false });
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

    checkLogin() {
      const userInfo = wx.getStorageSync('userInfo')
      console.log("当前登录信息：", userInfo)
  
      if (!userInfo) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          showCancel: false,
          success: () => {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        })
        return false
      }
  
      this.setData({ userInfo })
      return true
    },
  
    onLoad() {
      this.initScore(),
      this.setData({
        points: app.globalData.checkPoints,
        userScore: app.globalData.score
      })
    },
  
    onShow() {
      this.initScore(),
      this.setData({
        userScore: app.globalData.score
      })
    },
  
    initScore() {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({
          userInfo,
          userScore: userInfo.score || 0
        })
      }
    },

    showSign() {
      if (!this.checkLogin()) return
      this.setData({ showSign: true })
    },
  
    doSign() {
      const { userInfo } = this.data
      wx.cloud.callFunction({
        name: 'updateScore',
        data: { OPENID: userInfo.OPENID, changeScore: 50 }
      }).then(res => {
        userInfo.score = res.result.newScore
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userScore: res.result.newScore, showSign: false })
        wx.showToast({ title: '签到成功 +50', icon: 'success' })
      })

      wx.showToast({
        title: `兑换成功！`,
        icon: 'success',
        duration: 2000
      });

      this.hideModal();

      // wx.navigateTo({url: ''}, 1000)
    },
  
  // 积分明细
  goDetail() {
    wx.navigateTo({ url: '../order/order'})
  },
  
  // 点击上传按钮调用
  handleUpload() {
    uploadSingleImage((fileID) => {
      // 上传完成后的回调逻辑（每个页面可自定义）
      if (fileID) {
        this.setData({ imageUrl: fileID }); // index页面预览图片
        console.log('index页面上传成功，fileID：', fileID);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
