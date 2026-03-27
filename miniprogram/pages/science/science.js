Page({
    data: {
      currentTab: "scenery",
      bannerList: [],
      currentBanner: {},
      showModal: false,
      longImageUrl: "",
      bannerData: {}
    },
  
    // 从云数据库加载数据
    loadDataFromDB() {
      const db = wx.cloud.database();
  
      db.collection("science")
        .where({ isShow: true })
        .get()
        .then(res => {
          let list = res.data;
  
          let bannerData = {
            scenery: list.filter(i => i.type === "scenery"),
            food: list.filter(i => i.type === "food"),
            entertainment: list.filter(i => i.type === "entertainment")
          };
  
          this.setData({ bannerData }, () => {
            this.initBannerList();
          });
        });
    },
  
    onShow() {
      this.loadDataFromDB();
    },
  
    initBannerList() {
      const { currentTab, bannerData } = this.data;
      const currentData = bannerData[currentTab] || [];
      this.setData({
        bannerList: currentData,
        currentBanner: currentData[0] || {}
      });
    },
  
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({ currentTab: tab }, () => {
        this.initBannerList();
      });
    },
  
    // ✅ 打开详情长图（单独的 longImage 地址）
    openLongImage(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.bannerList.find(i => i.id === id);
      
      this.setData({
        showModal: true,
        longImageUrl: item.longImage // 这里用【长图地址】
      });
    },
  
    closeLongImage() {
      this.setData({ showModal: false, longImageUrl: "" });
    }
  });