const defaultAvatarUrl = '/images/login/DefaultAvatar.png'

Page({
    data: {
      userInfo:
      null,
    //    {
    //       avatar:"/images/banner/banner1.png",
    //       name:"knife"
    //   },
      showContact: false,
      showLoginPopup: false,
      avatarUrl: defaultAvatarUrl, // 保留你原来的
      tempName: "" // 只补一个缺失的变量
    },
    onChooseAvatar(e) {
        // 关键：用户取消选择时，不执行逻辑
        if (e.detail.avatarUrl) {
          // 正常选择头像才走这里
          console.log("选择头像成功", e.detail.avatarUrl)
          this.setData({
            avatarUrl: e.detail.avatarUrl
          })
        } else {
          // 用户取消选择，什么都不做，就不会报错
          console.log("用户取消选择头像")
        }
      },
    // 输入昵称（保留原样）
    onInputName(e) {
      this.setData({
        tempName: e.detail.value
      })
    },

    onLoad() {
      this.checkLogin()
    },

    onShow() {
      this.checkLogin()
    },

    // 检查登录
    checkLogin() {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({ userInfo })
      }
    },

    // 跳转登录页面
    goLogin() {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    },

    // 关闭登录弹窗
    closeLoginPopup() {
      this.setData({ showLoginPopup: false })
    },

    // 提交登录（完全保留你的逻辑，只修复变量）
    submitLogin() {
      const { avatarUrl, tempName } = this.data

      // 修复：用 avatarUrl 判断，不是 tempAvatar
      if (!avatarUrl || !tempName) {
        wx.showToast({ title: '请完善信息', icon: 'none' })
        return
      }

      wx.showLoading({ title: '登录中...' })

      wx.cloud.callFunction({
        name: "wechatLogin",
        data: {
          avatar: avatarUrl, // 用 avatarUrl 提交
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
        } else {
          wx.showToast({ title: '登录失败', icon: 'none' })
        }
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({ title: '网络异常', icon: 'none' })
      })
    },

    // 退出登录
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

    // 订单记录
    goToOrder(){
        wx.navigateTo({
          url: '/pages/order/order',
        })
    },

    // 关于我们
    showContact(){
        this.setData({
            showContact:true
        })
    },
    onConfirm(){
        this.setData({
            showContact:false
        })
    }
})