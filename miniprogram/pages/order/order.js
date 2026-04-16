// pages/order/order.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    list: []
  },

  onLoad() {
    let userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.score = app.globalData.score || 0
    this.setData({ userInfo })
    this.getList()
  },

  // ✅ 只加载当前用户自己的订单
  getList() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || !userInfo.name) {
      this.setData({ list: [] })
      return
    }

    const key = "orderList_" + userInfo.name
    const myOrders = wx.getStorageSync(key) || []
    
    this.setData({
      list: myOrders
    })
  }
})