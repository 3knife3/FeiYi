// pages/shop/shop.js
Page({

    data: {
      userInfo: null,
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
  
    // ======================
    // 统一登录校验（未登录自动跳转 login）
    // ======================
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
      this.initScore()
    },
  
    onShow() {
      this.initScore()
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
  
    // ======================
    // 每日签到（未登录→跳转）
    // ======================
    showSign() {
      if (!this.checkLogin()) return
      this.setData({ showSign: true })
    },
  
    doSign() {
      const { userInfo } = this.data
      wx.cloud.callFunction({
        name: 'updateScore',
        data: { openid: userInfo.OPENID, changeScore: 50 }
      }).then(res => {
        userInfo.score = res.result.newScore
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userScore: res.result.newScore, showSign: false })
        wx.showToast({ title: '签到成功 +50', icon: 'success' })
      })
    },
  
    closeSignPopup() {
      this.setData({ showSign: false })
    },
  
    // ======================
    // 分享（未登录→跳转）
    // ======================
    showShare() {
      if (!this.checkLogin()) return
      this.setData({ showShare: true })
    },
  
    closeSharePopup() {
      this.setData({ showShare: false })
    },
  
    // ======================
    // 打卡（未登录→跳转）
    // ======================
    showCheckIn() {
      if (!this.checkLogin()) return
      this.setData({ showCheckIn: true })
    },
  
    doCheckIn() {
      const { userInfo } = this.data
      wx.cloud.callFunction({
        name: 'updateScore',
        data: { openid: userInfo.OPENID, changeScore: 20 }
      }).then(res => {
        userInfo.score = res.result.newScore
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userScore: res.result.newScore, showCheckIn: false })
        wx.showToast({ title: '打卡成功 +20', icon: 'success' })
      })
    },
  
    closeCheckInPopup() {
      this.setData({ showCheckIn: false })
    },
  
    // ======================
    // 兑换商品（未登录→跳转）
    // ======================
    showExchangeModal(e) {
      if (!this.checkLogin()) return
  
      const { id, cost, name } = e.currentTarget.dataset
      this.setData({
        showModal: true,
        selectedId: id,
        selectedCost: cost,
        selectedName: name
      })
    },
  
    hideModal() {
      this.setData({ showModal: false })
    },
  
    confirmExchange() {
      const { userInfo, userScore, selectedCost, selectedName } = this.data
  
      if (userScore < selectedCost) {
        wx.showToast({ title: '积分不足', icon: 'none' })
        this.hideModal()
        return
      }
  
      wx.showLoading({ title: '兑换中...' })
  
      wx.cloud.callFunction({
        name: 'exchangeGoods',
        data: {
          openid: userInfo.OPENID,
          goodsName: selectedName,
          costScore: selectedCost
        }
      }).then(res => {
        wx.hideLoading()
        userInfo.score = res.result.newScore
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userScore: res.result.newScore })
        wx.showToast({ title: '兑换成功' })
        this.hideModal()
      })
    },
  
    goDetail() {
      wx.navigateTo({ url: '/pages/order/order' })
    },
  
    onReady() {},
    onHide() {},
    onUnload() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onShareAppMessage() {}
  })