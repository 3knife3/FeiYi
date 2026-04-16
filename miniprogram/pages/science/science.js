const app = getApp(); // 顶行加这个
Page({
    data: {
      currentTab: "scenery",
      bannerList: [],
      currentBanner: {},
      showModal: false,
      longImageUrl: "",
      bannerData: {},
      showQuizModal: false,   // 只加这一行
      currentQuiz: {},  // <-- 加这一行
      selectedAnswer: null // 新增：记录用户选择的答案索引
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

    // 👇 这里是关键！！！
    const activeTab = app.globalData.scienceTab;

    if (activeTab) {
      // 切换到对应栏目
      this.setData({ currentTab: activeTab }, () => {
        this.initBannerList();
      });
      // 清空，防止重复触发
      app.globalData.scienceTab = "";
    }
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
        longImageUrl: item.longImage, // 这里用【长图地址】
        currentQuiz: item  // <-- 只加这一行
      });
    },
  
    closeLongImage() {
      this.setData({ 
          showModal: false, 
          longImageUrl: "",
          showQuizModal: false  // 加这一句 
        });
    },

    // 打开问答弹窗
    openQuizModal() {
        this.setData({ showQuizModal: true });
    },
  
    // 关闭问答弹窗（点击背景关闭）
    closeQuizModal() {
        this.setData({ showQuizModal: false });
    },
  
    // 禁止点击内容区关闭弹窗
    voidClick() {},

    // 新增：检查答案方法（完全符合你现有命名规范）
    checkAnswer(e) {
        if (this.data.selectedAnswer !== null) return;
      
        // 👇 调试输出（我加的，不影响功能）
        console.log("===== 答题调试 =====");
        const userIndex = parseInt(e.currentTarget.dataset.index);
        const rightIndex = this.data.currentQuiz.quizAnswer;
        console.log("用户选择：", userIndex, " 类型：", typeof userIndex);
        console.log("正确答案：", rightIndex, " 类型：", typeof rightIndex);
        console.log("是否相等：", userIndex === rightIndex);
      
        this.setData({
          selectedAnswer: userIndex
        });
      
        wx.showToast({
          title: userIndex === rightIndex ? "回答正确 ✅" : "回答错误 ❌",
          icon: userIndex === rightIndex ? "success" : "error",
          duration: 1000
        });
      }
  });