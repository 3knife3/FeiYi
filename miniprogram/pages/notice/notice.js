// pages/notice/notice.js
const db = wx.cloud.database()

Page({
  data: {
    noticeList: [], // 页面展示的公告列表
    pageSize: 3,   // 每页加载3条
    hasMore: true, // 是否还有更多数据
    loading: false // 加载状态锁，防止重复请求
  },

  onLoad() {
    // 页面加载时，先清空列表，重置状态
    this.setData({
      noticeList: [],
      hasMore: true,
      loading: false
    })
    // 加载第一页
    this.loadMore()
  },

  // 加载更多（核心修复：按createTime倒序分页+去重）
  async loadMore() {
    // 加锁：防止重复点击/上拉导致重复请求
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      // 1. 构造查询：按createTime倒序，保证分页顺序正确
      let query = db.collection('notice')
        .orderBy('createTime', 'desc')
        .limit(this.data.pageSize)

      // 2. 分页：非第一页，从最后一条的createTime之后查询
      if (this.data.noticeList.length > 0) {
        const lastItem = this.data.noticeList[this.data.noticeList.length - 1]
        query = query.where({
          createTime: db.command.lt(lastItem.createTime)
        })
      }

      // 3. 发起请求
      const res = await query.get()
      const newData = res.data

      // 4. 数据去重：防止重复数据
      const uniqueNewData = newData.filter(item => {
        return !this.data.noticeList.some(exist => exist._id === item._id)
      })

      // 5. 格式化时间+处理换行
      const formatData = uniqueNewData.map(item => {
        const d = item.createTime
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        // 处理换行：\n转真实换行
        const content = item.content.replace(/\\n/g, '\n')
        return { ...item, dateStr, content }
      })

      // 6. 更新数据
      this.setData({
        noticeList: [...this.data.noticeList, ...formatData],
        hasMore: newData.length === this.data.pageSize, // 不足3条，说明没有更多了
        loading: false
      })

    } catch (err) {
      console.error('加载公告失败：', err)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 上拉触底加载
  onReachBottom() {
    this.loadMore()
  },

  // 页面下拉刷新（可选，强制刷新数据）
  onPullDownRefresh() {
    // 下拉刷新：清空列表，重新加载
    this.setData({
      noticeList: [],
      hasMore: true,
      loading: false
    })
    this.loadMore()
    wx.stopPullDownRefresh()
  }
})