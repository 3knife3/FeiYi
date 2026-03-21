// index.js
Page({
  data: {
    swiperList: [
    {id: '1', imgUrl: '/images/banner/banner1.png'},
    {id: '2', imgUrl: '/images/banner/banner2.png'},
    {id: '3', imgUrl: '/images/banner/banner3.png'}
    ],
    importantNotice: '今日打卡规则调整：需完成定位打卡才有效',
    latestNotice: '逢简水乡非遗小程序正在部署中...',
    functionList: 
    [
      {name: '科普', icon: '/images/function/science.png'},
      {name: '美食', icon: '/images/function/food.png'},
      {name: '娱乐', icon: '/images/function/entertainment.png'},
      {name: '路线推荐', icon: '/images/function/route.png'},
      {name: '打卡', icon: '/images/function/checkin.png'}
    ]
  },
  navigateToPage(e) {
    const name = e.currentTarget.dataset.name;
    switch(name) {
      case '科普':
        wx.switchTab({url: '/pages/science/science'});
        break;
      case '美食':
        wx.switchTab({url: '/pages/science/science'});
        break;  
      case '娱乐':
        wx.switchTab({url: '/pages/science/science'});
        break;
      case '路线推荐':
        wx.navigateTo({url: '/pages/route/route'});
        break;
      case '打卡':
        wx.showToast({
          title:"打卡成功！",
          icon:"success"
        });
        break;
      default:
        wx.showToast({title: '功能暂未开放', icon: 'none'});  
    }
  },
  previewMap() {
    // 1. 获取文件管理器
    const fs = wx.getFileSystemManager();
    // 2. 你的图片本地路径（注意：去掉开头的 /，改为相对路径）
    const localPath = 'images/map/new_map.png';

    try {
      // 3. 读取本地文件转成临时路径 (这是关键！)
      const fileContent = fs.readFileSync(localPath, 'base64');
      const tempPath = `data:image/jpg;base64,${fileContent}`;

      // 4. 调用原生预览（此时用的是base64临时路径，必能加载）
      wx.previewImage({
        current: tempPath,
        urls: [tempPath],
        fail: (err) => {
          console.error('预览失败', err);
          wx.showToast({ title: '图片加载失败', icon: 'none' });
        }
      });
    } catch (e) {
      // 捕获错误：99%是路径写错了
      wx.showToast({
        title: `图片不存在: ${localPath}`,
        icon: 'none',
        duration: 3000
      });
      console.error('文件读取失败，请检查路径：', e);
    }
  }
});
