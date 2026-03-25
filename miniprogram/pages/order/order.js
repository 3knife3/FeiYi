// pages/order/order.js
Page({
    data: { userInfo: null, list: [] },
  
    onLoad() {
      this.setData({ userInfo: wx.getStorageSync('userInfo') })
      this.getList()
    },
  
    getList() {
      const user = this.data.userInfo
    //   if (!user) return
    
    if (!user || !user.OPENID) {  // 👈 多加一层判断，没有就不走
        console.log('没有OPENID，不请求')
        return
      wx.cloud.callFunction({
        name: 'getOrders',
        data: { OPENID: user.OPENID }
      })
      .then(res => {
        this.setData({ list: res.result.data })
      })
    }
    }
  })

