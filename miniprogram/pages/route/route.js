// pages/route/route.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',                // 搜索关键词
    isSearchFocus: false,            // 搜索框是否聚焦
    currentCategory: 'all',   // 当前选中的分类，默认'all'代表全部
    categoryTags: [                  // 分类标签
      { label: '小众好玩', value: '小众好玩' },
      { label: '趣味打卡', value: '趣味打卡' },
      { label: '经典必玩', value: '经典必玩' },
      { label: '省力路线', value: '省力路线' }
    ],
    // 路线数据 (模拟数据)
    allRoutes: [
      {
        id: 1,
        name: '水乡秘境地',
        tag: '人少出片',
        category: '小众好玩',
        spots: [
          { name: '财神庙', duration: '20min' },
          { name: '明远桥', duration: '15min' },
          { name: '觉妙净院', duration: '30min' },
          { name: '进士牌坊', duration: '10min' },
          { name: '巨济桥', duration: '15min' },
          { name: '和之梁公祠', duration: '25min' },
          { name: '游船码头', duration: '20min' },
          { name: '祥胜桥', duration: '10min' },
          { name: '郭氏祖祠', duration: '25min' },
          { name: '石狮巷桥', duration: '10min' },
          { name: '中心公园', duration: '20min' },
          { name: '人口文化公园', duration: '15min' },
          { name: '金鳌桥', duration: '10min' },
          { name: '刘氏大宗祠', duration: '40min' },
          { name: '宋参政李公祠', duration: '30min' }
        ]
      },
      {
        id: 2,
        name: '桥影打卡线',
        tag: '拍照打卡',
        category: '趣味打卡',
        spots: [
          { name: '逢简市场', duration: '28min' },
          { name: '郭氏祖祠', duration: '10min' },
          { name: '巨济桥', duration: '10min' },
          { name: '和之梁公祠', duration: '34min' },
          { name: '进士牌坊', duration: '14min' },
          { name: '觉妙净院', duration: '24min' },
          { name: '明远桥', duration: '20min' },
          { name: '宋参政李公祠', duration: '31min' },
          { name: '刘氏大宗祠', duration: '42min' },
          { name: '金鳌桥', duration: '15min' }
        ]
      },
      {
        id: 3,
        name: '人间烟火线',
        tag: '人气推荐',
        category: '经典必玩',
        spots: [
          { name: '财神庙', duration: '14min' },
          { name: '明远桥', duration: '17min' },
          { name: '觉妙净院', duration: '33min' },
          { name: '进士牌坊', duration: '12min' },
          { name: '巨济桥', duration: '11min' },
          { name: '和之梁公祠', duration: '29min' },
          { name: '游船码头', duration: '25min' },
          { name: '祥胜桥', duration: '14min' },
          { name: '郭氏祖祠', duration: '26min' },
          { name: '石狮巷桥', duration: '13min' },
          { name: '中心公园', duration: '24min' },
          { name: '人口文化公园', duration: '25min' },
          { name: '金鳌桥', duration: '12min' },
          { name: '刘氏大宗祠', duration: '38min' },
          { name: '宋参政李公祠', duration: '38min' },
          { name: '财神庙', duration: '12min' }
        ]
      },
      {
        id: 4,
        name: '悠然闲步线',
        tag: '长辈友好',
        category: '省力路线',
        spots: [
          { name: '游客中心', duration: '15min' },
          { name: '巨济桥（拍照点）', duration: '25min' },
          { name: '进士牌坊（美食街）', duration: '40min' },
          { name: '金鳌桥', duration: '15min' },
          { name: '游船码头', duration: '20min' }
        ]
      },
      {
        id: 5,
        name: '美食水乡线',
        tag: '顺德美食',
        category: '趣味打卡',
        spots: [
          { name: '杏坛市场', duration: '15min' },
          { name: '双桥美食店', duration: '25min' },
          { name: '明远桥', duration: '40min' },
          { name: '逢简水乡', duration: '15min' },
          { name: '觉妙净院', duration: '20min' }
        ]
      },
      {
        id: 6,
        name: '官方游览线路1',
        tag: '推荐正式',
        category: '经典必玩',
        spots: [
          { name: '逢简新地', duration: '10min' },
          { name: '古钓矶', duration: '15min' },
          { name: '逢简人口文化公园', duration: '20min' },
          { name: '石狮巷桥', duration: '10min' },
          { name: '郭氏祖祠', duration: '25min' },
          { name: '进士牌坊', duration: '30min' },
          { name: '巨济桥', duration: '25min' },
          { name: '和之梁公祠', duration: '20min' },
          { name: '游船码头', duration: '20min' },
          { name: '祥胜桥', duration: '10min' },
          { name: '觉妙净院', duration: '25min' },
          { name: '明远桥', duration: '15min' },
          { name: '宋参政李公祠', duration: '20min' },
          { name: '逢简历史馆', duration: '30min' },
          { name: '刘氏祠堂', duration: '25min' },
          { name: '金鳌桥', duration: '15min' }
        ]
      },
      {
        id: 7,
        name: '官方游览线路2',
        tag: '推荐简约',
        category: '经典必玩',
        spots: [
          { name: '逢简新地', duration: '10min' },
          { name: '古钓矶', duration: '12min' },
          { name: '逢简人口文化公园', duration: '15min' },
          { name: '石狮巷桥', duration: '8min' },
          { name: '进士牌坊', duration: '20min' },
          { name: '巨济桥', duration: '18min' },
          { name: '和之梁公祠', duration: '15min' },
          { name: '游船码头', duration: '12min' },
          { name: '逢简驿站', duration: '10min' }
        ]
      },
    ],
    filteredRoutes: [],      // 过滤后展示的路线
    showModal: false,        // 路线详情弹窗
    currentRoute: { name: '', spots: [] },
    // 地图相关参数
    showMap: false,          // 地图弹窗开关
    scale: 1,                // 地图缩放比例
    lastScale: 1,            // 上一次缩放值
    tx: 0,                   // X轴偏移
    ty: 0,                   // Y轴偏移
    startX: 0,               // 触摸起始X
    startY: 0,               // 触摸起始Y
    startDistance: 0         // 双指起始距离
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      filteredRoutes: this.data.allRoutes
    });
  },

  // 点击搜索框聚焦
  focusSearch() {
    this.setData({
      isSearchFocus: true
    });
  },

  // 搜索框输入实时过滤
  onSearchInput(e) {
    // 1. 获取输入值并统一转小写处理
    const rawValue = e.detail.value.trim();
    const keyword = rawValue.toLowerCase();
    // 2. 保存原始输入（用于页面显示）
    this.setData({
      searchKeyword: rawValue
    });
    // 3. 执行过滤
    this.filterRoutes(keyword, this.data.currentCategory);
  },

  // 点击完成/回车搜索
  handleSearch() {
    // 1. 统一处理关键词
    const keyword = this.data.searchKeyword.trim().toLowerCase();
    // 2. 执行过滤
    this.filterRoutes(keyword, this.data.currentCategory);
    // 3. 收起键盘
    wx.hideKeyboard();
  },

  // 核心过滤逻辑（精简日志版）
  filterRoutes(keyword, category) {
    // 1. 从allRoutes获取原始数据并深拷贝
    let filteredRoutes = JSON.parse(JSON.stringify(this.data.allRoutes));

    // 2. 第一步：关键词过滤（优先）
    if (keyword && keyword.trim() !== '') {
      const lowerKeyword = keyword.toLowerCase().trim();
      filteredRoutes = filteredRoutes.filter(route => {
        // 匹配路线名称（转小写）
        const routeNameMatch = route.name.toLowerCase().includes(lowerKeyword);
        // 匹配景点名称（支持带括号的名称）
        const spotNameMatch = route.spots.some(spot => 
          spot.name.toLowerCase().includes(lowerKeyword)
        );
        return routeNameMatch || spotNameMatch;
      });
    }

    // 3. 第二步：分类过滤（排除'all'的情况）
    if (category && category !== 'all') {
      filteredRoutes = filteredRoutes.filter(route => 
        route.category === category
      );
    }

    // 4. 更新过滤后的数据
    this.setData({
      filteredRoutes: filteredRoutes
    });
  },

  // 选择分类标签
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    let newCategory = category;
    // 点击同个分类，切换为显示全部
    if (this.data.currentCategory === category) {
      newCategory = 'all';
    }
    // 更新分类并重新过滤
    this.setData({ currentCategory: newCategory });
    this.filterRoutes(
      this.data.searchKeyword.trim().toLowerCase(), 
      newCategory
    );
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
  closeModal() {
    this.setData({ showModal: false });
  },

  // 阻止冒泡 (用于弹窗内容点击不关闭)
  stopPropagation() {},

  // ===== 地图弹窗逻辑 =====
  // 打开地图弹窗
  showMapPopup() {
    this.setData({
      showMap: true,
      scale: 1,
      lastScale: 1,
      tx: 0,
      ty: 0
    });
  },
  // 关闭地图弹窗
  hideMapPopup() {
    this.setData({ showMap: false });
  },
  // 触摸开始（缩放/拖动）
  touchStart(e) {
    if (e.touches.length === 2) {
      // 双指缩放：计算初始距离
      const x1 = e.touches[0].clientX;
      const y1 = e.touches[0].clientY;
      const x2 = e.touches[1].clientX;
      const y2 = e.touches[1].clientY;
      this.setData({
        startDistance: Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        lastScale: this.data.scale
      });
    }
  },
  // 触摸移动（缩放/拖动）
  touchMove(e) {
    if (e.touches.length === 2) {
      // 双指缩放（限制0.8-2倍）
      const x1 = e.touches[0].clientX;
      const y1 = e.touches[0].clientY;
      const x2 = e.touches[1].clientX;
      const y2 = e.touches[1].clientY;
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const scale = (distance / this.data.startDistance) * this.data.lastScale;
      this.setData({ scale: Math.max(0.8, Math.min(2, scale)) });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
});