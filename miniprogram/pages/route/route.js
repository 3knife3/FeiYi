// pages/route/route.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',                // 搜索关键词
    currentCategory: 'all',            // 当前选中的分类，默认'all'代表全部
    categoryTags: [                    // 分类标签，包含“全部”便于逻辑，但UI隐藏了“全部”按钮，用户可通过清空分类查看全部
      { label: '亲子', value: '亲子' },
      { label: '朋友', value: '朋友' },
      { label: '情侣', value: '情侣' },
      { label: '家人', value: '家人' }
    ],
    // 路线数据 (模拟数据，实际可替换为接口)
    allRoutes: [
      {
        id: 1,
        name: '经典山水漫步',
        tag: '人气推荐',
        category: '朋友',
        spots: [
          { name: '迎客松', duration: '30min' },
          { name: '一线天', duration: '20min' },
          { name: '天都峰', duration: '1.5h' }
        ]
      },
      {
        id: 2,
        name: '亲子欢乐之旅',
        tag: '适合儿童',
        category: '亲子',
        spots: [
          { name: '熊猫乐园', duration: '1h' },
          { name: '童话森林', duration: '45min' },
          { name: '彩虹滑道', duration: '30min' },
          { name: '萌宠剧场', duration: '40min' }
        ]
      },
      {
        id: 3,
        name: '浪漫情侣步道',
        tag: '私密',
        category: '情侣',
        spots: [
          { name: '同心锁桥', duration: '20min' },
          { name: '日落观景台', duration: '1h' },
          { name: '玫瑰园', duration: '30min' }
        ]
      },
      {
        id: 4,
        name: '全家福文化线',
        tag: '长辈友好',
        category: '家人',
        spots: [
          { name: '古寺祈福', duration: '40min' },
          { name: '历史陈列馆', duration: '1h' },
          { name: '茶歇长廊', duration: '30min' }
        ]
      },
      {
        id: 5,
        name: '户外探险组合',
        tag: '刺激',
        category: '朋友',
        spots: [
          { name: '飞拉达', duration: '2h' },
          { name: '山顶索道', duration: '25min' },
          { name: '野餐营地', duration: '1.5h' }
        ]
      },
      {
        id: 6,
        name: '亲子研学路线',
        tag: '知识',
        category: '亲子',
        spots: [
          { name: '自然博物馆', duration: '1h' },
          { name: '蝴蝶谷', duration: '50min' },
          { name: '手工作坊', duration: '1h' }
        ]
      },
      {
        id: 7,
        name: '夕阳红慢游',
        tag: '休闲',
        category: '家人',
        spots: [
          { name: '荷花池', duration: '30min' },
          { name: '书画院', duration: '40min' },
          { name: '养生步道', duration: '1h' }
        ]
      }
    ],
    filteredRoutes: [],      // 过滤后展示的路线
    showModal: false,        // 弹窗显示控制
    currentRoute: { name: '', spots: [] }   // 当前查看的路线详情
  },
  
    // 这里可以后续接入地图导航

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      filteredRoutes: this.data.allRoutes
    });
  },
  // 搜索框输入
  onSearchInput(e) {
    const keyword = e.detail.value.trim().toLowerCase();
    this.setData({ searchKeyword: e.detail.value });
    this.filterRoutes(keyword, this.data.currentCategory);
  },

  // 点击完成搜索 (也可和输入实时一致)
  handleSearch() {
    this.filterRoutes(this.data.searchKeyword.toLowerCase(), this.data.currentCategory);
  },

  // 选择分类标签
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    // 如果点击同一个分类，可以设计为取消选中? 这里简单处理：点击不同切换，再次点击不变。如果需要“全部”，可以加一个全部按钮。但需求只有四个按钮，所以默认当前选中高亮。
    // 另外用户想要查看全部路线：我们通过搜索框留空 + 任意分类取消？ 实际上加上一个“全部”比较好，但考虑到需求只提到四个，暂时增加一个隐藏逻辑：点击当前激活的分类则置为'all'显示全部，提升体验。
    let newCategory = category;
    if (this.data.currentCategory === category) {
      // 如果点击同一个，视为显示全部（取消分类限制）
      newCategory = 'all';
    }
    this.setData({ currentCategory: newCategory });
    this.filterRoutes(this.data.searchKeyword.toLowerCase(), newCategory);
  },

  // 过滤路线 (关键词 + 分类)
  filterRoutes(keyword, category) {
    let routes = this.data.allRoutes;

    // 关键词过滤 (搜索景点名称或路线名称)
    if (keyword) {
      routes = routes.filter(route => {
        // 路线名称包含关键词
        if (route.name.toLowerCase().includes(keyword)) return true;
        // 景点列表中任意景点包含关键词
        return route.spots.some(spot => spot.name.toLowerCase().includes(keyword));
      });
    }

    // 分类过滤 (如果category不是'all')
    if (category && category !== 'all') {
      routes = routes.filter(route => route.category === category);
    }

    this.setData({ filteredRoutes: routes });
  },

  // 打开详情弹窗
  openRouteDetail(e) {
    const route = e.currentTarget.dataset.route;
    this.setData({
      currentRoute: route,
      showModal: true
    });
  },

  // 关闭弹窗
  closeModal(e) {
    // 如果点击的是蒙层(mask)或者直接点击关闭按钮
    this.setData({ showModal: false });
  },

  // 阻止冒泡 (用于弹窗内容点击不关闭)
  stopPropagation() {
    // 空函数，仅用于阻止冒泡
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