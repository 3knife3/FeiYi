const defaultAvatarUrl = '/images/login/DefaultAvatar.png'

Page({
  data: {
    userInfo: null,
    showContact: false,
    showLoginPopup: false,
    avatarUrl: defaultAvatarUrl,
    tempName: ""
  },

  // 选择头像
  onChooseAvatar(e) {
    if (e.detail.avatarUrl) {
      console.log("选择头像成功", e.detail.avatarUrl)
      this.setData({
        avatarUrl: e.detail.avatarUrl
      })
    } else {
      console.log("用户取消选择头像")
    }
  },

  // 输入昵称
  onInputName(e) {
    this.setData({
      tempName: e.detail.value
    })
  },

  // ======================
  // 一键获取微信昵称
  // ======================
  getWxNickName() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log("获取微信昵称成功", res.userInfo.nickName)
        this.setData({
          tempName: res.userInfo.nickName
        })
      },
      fail: () => {
        wx.showToast({ title: '已取消', icon: 'none' })
      }
    })
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    this.checkLogin()
  },

  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  closeLoginPopup() {
    this.setData({ showLoginPopup: false })
  },

  // ======================================
  // 提交登录（只加了 wx.login() 获取 code）
  // ======================================
  submitLogin() {
    const { avatarUrl, tempName } = this.data

    if (!avatarUrl || !tempName) {
      wx.showToast({ title: '请完善信息', icon: 'none' })
      return
    }

    wx.showLoading({ title: '登录中...' })

    // +++++++++++++ 新增：获取微信登录 code +++++++++++++
    wx.login({
      success: (res) => {
        if (res.code) {
          // 把 code 传给云函数
          wx.cloud.callFunction({
            name: "wechatLogin",
            data: {
              code: res.code,  // <-- 关键：openid 凭证
              avatar: avatarUrl,
              name: tempName
            }
          }).then(res => {
            wx.hideLoading()
            const result = res.result

            if (result.code === 0) {
              wx.setStorageSync('userInfo', result.userInfo)
              this.setData({
                userInfo: result.userInfo,
                showLoginPopup: false
              })
              wx.showToast({ title: '登录成功' })
              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            } else {
              wx.showToast({ title: '登录失败', icon: 'none' })
            }
          }).catch(err => {
            wx.hideLoading()
            wx.showToast({ title: '网络异常', icon: 'none' })
          })
        }
      }
    })
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          this.setData({ userInfo: null });
          wx.showToast({ title: '已退出登录' })
        }
      }
    });
  },

  goToOrder() {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },

  showContact() {
    this.setData({
      showContact: true
    })
  },

  onConfirm() {
    this.setData({
      showContact: false
    })
  }
})