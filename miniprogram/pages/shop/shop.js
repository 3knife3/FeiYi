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
    wx.showToast({title:'签到成功 +50', icon:'success'})
    this.setData({userScore: this.data.userScore + 50, showSign: false})
  },
  closeSignPopup() {
    this.setData({ showSign: false });
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
