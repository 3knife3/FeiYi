Page({
    data: {
      currentTab: "scenery",
      bannerList: [],
      currentBanner: {},
      showModal: false,
      longImageUrl: ""
    },
  
    loadDataFromDB() {
        const db = wx.cloud.database();
    
        db.collection("science") // 你的数据库集合名
          .where({ isShow: true })
          .get()
          .then(res => {
            let list = res.data;
    
            // 自动按 type 分类
            let bannerData = {
              scenery: list.filter(i => i.type === "scenery"),
              food: list.filter(i => i.type === "food"),
              entertainment: list.filter(i => i.type === "entertainment")
            };
    
            this.setData({
              bannerData: bannerData
            }, () => {
              this.initBannerList();
            });
          });
      },

    // 首页快捷键跳转栏目函数
    onShow() {
        const targetTab = getApp().globalData.scienceTab || "scenery";
        this.setData({
          currentTab: targetTab
        }, () => {
          this.loadDataFromDB();
        });
      },
  
    // 标签跳转函数
    initBannerList() {
      const { currentTab, bannerData } = this.data;
      const currentData = bannerData[currentTab] || [];
      this.setData({
        bannerList: currentData,
        currentBanner: currentData[0] || {}
      });
    },
//   点击栏目标签之后跳转
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({
        currentTab: tab
      }, () => {
        this.initBannerList();
      });
    },
  
    // 滑动轮播图片跳转（保留，不影响）
    onSwiperChange(e) {
      const index = e.detail.current;
      const { bannerList } = this.data;
      if (bannerList[index]) {
        this.setData({
          currentBanner: bannerList[index]
        });
      }
    },

    //弹窗打开
    openLongImage(e) {
        const id = e.currentTarget.dataset.id;
        const { bannerList } = this.data;
        const item = bannerList.find(i => i.id === id);

        console.log("长图地址 =", item?.longImage); // 👈 大写 L
      
        if (!item || !item.longImage) {
            wx.showToast({ title: '暂无长图介绍', icon: 'none' });
            return;
          }
        
          // 直接赋值本地路径，去掉所有云调用代码
          this.setData({
            showModal: true,
            longImageUrl: item.longImage
          });
        },
  
    // 弹窗关闭
  closeLongImage() {
    this.setData({
      showModal: false,
      longImageUrl: ""
    });
  }
})