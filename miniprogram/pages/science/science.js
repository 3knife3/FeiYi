Page({
    data: {
      currentTab: "scenery", // 当前栏目：scenery/food/entertainment
      bannerList: [], // 当前轮播数据
      currentBanner: {}, // 当前显示的大图标题/文字
  
      // 三套轮播图数据（可以替换成你的图片）
      bannerData: {
        scenery: [
          { id: 1, image: "/images/science/sci1.png", title: "绿藻景区", desc: "绿藻景区位于XX位置，是著名的自然景观。" },
          { id: 2, image: "/images/science/sci2.png", title: "森林公园", desc: "森林公园拥有大片植被与湖泊，适合郊游。" }
        ],
        food: [
          { id: 1, image: "/images/science/sci3.png", title: "特色美食", desc: "本地特色美食包括烤鱼、面食、小吃。" },
          { id: 2, image: "/images/science/sci1.png", title: "美味佳肴", desc: "本地美味佳肴非常受欢迎，口感独特。" }
        ],
        entertainment: [
          { id: 1, image: "/images/science/sci2.png", title: "娱乐项目", desc: "娱乐项目包括游船、攀岩、骑行等。" },
          { id: 2, image: "/images/science/sci3.png", title: "休闲体验", desc: "休闲体验适合全家游玩，轻松愉快。" }
        ]
      }
    },
  
    onLoad() {
      this.initBannerList();
    },
  
    // 初始化轮播图
    initBannerList() {
      const { currentTab, bannerData } = this.data;
      this.setData({
        bannerList: bannerData[currentTab],
        currentBanner: bannerData[currentTab][0]
      });
    },
  
    // 切换栏目
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({
        currentTab: tab
      }, () => {
        this.initBannerList();
      });
    },
  
    // 轮播滑动切换
    onSwiperChange(e) {
      const index = e.detail.current;
      const { bannerList } = this.data;
      this.setData({
        currentBanner: bannerList[index]
      });
    },
  
    // 点击进入详情页
    goToDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    }
  })