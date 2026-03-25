// pages/order/order.js
Page({
    data: { userInfo: null, list: [] },
  
    onLoad() {
      this.setData({ userInfo: wx.getStorageSync('userInfo') })
      this.getList()
    },
  
    getList() {
      const user = this.data.userInfo
      if (!user) return
      wx.cloud.callFunction({
        name: 'getOrders',
        data: { openid: user.OPENID }
      }).then(res => {
        this.setData({ list: res.result.data })
      })
    }
  })