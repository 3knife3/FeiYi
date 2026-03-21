// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userScore: 1280,
    notice: "积分商城正在部署中...",
    showSign: false,
    showShare: false,
    showCheckIn: false,
    selecetedCost: 0,
    selecetedName: '',
    selecetedId: 0,
    showModal: false,
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
    wx.showToast({title:'签到成功 +50', icon:'success'})
    this.setData({userScore: this.data.userScore + 50, showSign: false})
  },
  closeSignPopup() {
    this.setData({ showSign: false });
  },
  
  
  // 分享弹窗
  showShare() {this.setData({showShare: true})},
  closeSharePopup() {
    this.setData({ showShare: false });
  },

  // 打卡弹窗
  showCheckIn() {this.setData({showCheckIn: true})},
  doCheckIn() {
    wx.showToast({title:'打卡成功 +20', icon:"success"})
    this.setData({
      userScore: this.data.userScore + 20,
      showCheckIn: false
    })
  },
  closeCheckInPopup() {
    this.setData({ showCheckIn: false });
  },

  // 兑换
  // 显示兑换确认的弹窗
  showExchangeModal(e) {
    const {id, cost, name} = e.currentTarget.dataset;
    this.setData({
      showModal: true,
      selectedId: id,
      selectedCost: cost,
      selectedName: name
    })
  },
  // 隐藏弹窗（取消兑换）
  hideModal() {
    this.setData({showModal: false});
  },
  // 确认兑换（校验 + 扣减积分）
  confirmExchange() {
    const {userScore, selectedCost, selectedName} = this.data;
    if (userScore < selectedCost) {
      wx.showToast({
        title:'积分不足，无法兑换',
        icon: 'none',
        duration: 2000
      });
      this.hideModal();
      return;
    }
    wx.showLoading({title: '兑换中...'});
    // 模拟接口请求
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        userScore: userScore - selectedCost
      })

      wx.showToast({
        title: `兑换成功！`,
        icon: 'success',
        duration: 2000
      });

      this.hideModal();

      // wx.navigateTo({url: ''}, 1000)
    }, 400)
  },

  // 积分明细
  goDetail() {
    wx.navigateTo({ url: '../order/order'})
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