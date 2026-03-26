// index.js
// 引入全局上传工具函数
const { uploadSingleImage } = require('../../utils/uploadImage.js');

Page({
  data: {
    mapUrl: "", // 页面显示用的临时地址
    // swiperList: [
    // {id: '1', imgUrl: '/images/banner/banner1.png'},
    // {id: '2', imgUrl: '/images/banner/banner2.png'},
    // {id: '3', imgUrl: '/images/banner/banner3.png'}
    // ],

    swiperList: [], // 空的，我们从云函数拿Base64
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

//   onLoad() {
//     // 把云路径转成临时可访问路径
//     const cloudUrl = "cloud://cloud1-2gp5ez590981c671.map/new_map.png";
//     wx.cloud.getTempFileURL({
//       fileList: [cloudUrl],
//       success: (res) => {
//         console.log("✅ 图片临时地址获取成功", res.fileList[0].tempFileURL);
//         this.setData({
//           mapUrl: res.fileList[0].tempFileURL
//         });
//       },
//       fail: (err) => {
//         console.error("❌ 获取图片地址失败", err);
//       }
//     });
//   },


  // 获取轮播图（云存储 → Base64）
  getCloudBannerImages() {
    const fileList = [
      "cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner1.png",
      "cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner2.png",
      "cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/banner/banner3.png"
    ];

    let result = [];
    let count = 0;

    fileList.forEach((fileID, index) => {
      wx.cloud.callFunction({
        name: "getImageBase64",
        data: { fileID },
        success: (res) => {
          result[index] = {
            id: index + 1,
            imgUrl: res.result.data
          };
          count++;
          if (count === fileList.length) {
            this.setData({ swiperList: result });
            console.log("✅ 轮播图全部加载完成！");
          }
        }
      });
    });
  },
  
  onLoad() {
    // 原来的地图
    this.getMapUrl();
  
    // 👇 加上这一行！调用轮播图函数！
    this.getCloudBannerImages();
  },

  navigateToPage(e) {
    const name = e.currentTarget.dataset.name;
    const app = getApp();
    switch(name) {
      case '科普':
        wx.switchTab({url: '/pages/science/science'});
        break;
      case '美食':
        app.globalData.scienceTab = 'food'; 
        wx.switchTab({
          url: '/pages/science/science',
        })
        break;  
      case '娱乐':
        app.globalData.scienceTab = 'entertainment'; 
        wx.switchTab({
          url: '/pages/science/science',
        })
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
    // 直接用你拿到的云存储外网地址
    const cloudImageUrl = "https://636c-cloud1-2gp5ez590981c671-1383410318.tcb.qcloud.la/map/new_map.png?sign=9124e499f4bd70946710d9ad4609472c&t=1774539541";
  
    wx.previewImage({
      current: cloudImageUrl,
      urls: [cloudImageUrl],
      success: () => {
        console.log("✅ 云存储图片预览成功");
      },
      fail: (err) => {
        console.error("❌ 预览失败", err);
      }
    });
  },


//   获取云图片临时地址（给页面显示用）
  getMapUrl() {
    // 👇 这是你云存储里的真实完整路径！从云开发控制台复制过来！
    const realCloudUrl = "cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/map/new_map.png";
    
    wx.cloud.getTempFileURL({
      fileList: [realCloudUrl],
      success: (res) => {
        console.log("✅ 页面地图地址获取成功", res.fileList[0].tempFileURL);
        this.setData({
          mapUrl: res.fileList[0].tempFileURL // 赋值给页面
        });
      },
      fail: (err) => {
        console.error("❌ 获取地图地址失败", err);
      }
    });
  },

  handleUpload() {
    uploadSingleImage((fileID) => {
      // 上传完成后的回调逻辑（每个页面可自定义）
      if (fileID) {
        this.setData({ imageUrl: fileID }); // index页面预览图片
        console.log('index页面上传成功，fileID：', fileID);
      }
    });
  }
});
