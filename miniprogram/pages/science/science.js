Page({
    data: {
      currentTab: "scenery",
      bannerList: [],
      currentBanner: {},
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
  
    initBannerList() {
      const { currentTab, bannerData } = this.data;
      // 增加容错：避免数据为空导致报错
      const currentData = bannerData[currentTab] || [];
      this.setData({
        bannerList: currentData,
        currentBanner: currentData[0] || {}
      });
    },
  
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({
        currentTab: tab
      }, () => {
        this.initBannerList();
      });
    },
  
    onSwiperChange(e) {
      const index = e.detail.current;
      const { bannerList } = this.data;
      // 增加边界判断：防止下标越界
      if (bannerList[index]) {
        this.setData({
          currentBanner: bannerList[index]
        });
      }
    },
  
    goToDetail(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    }
  });