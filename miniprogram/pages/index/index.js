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
//   previewMap() {
//     // // 1. 获取文件管理器
//     // const fs = wx.getFileSystemManager();
//     // // 2. 你的图片本地路径（注意：去掉开头的 /，改为相对路径）
//     // const localPath = 'images/map/new_map.png';

//   const cloudUrl = "cloud://cloud1-2gp5ez590981c671.map/new_map.png";
//   // 打印日志，看有没有执行到这里
//   console.log("✅ 预览地图执行");
//   console.log("✅ 云端图片地址：", cloudUrl);

//     try {
//       // 3. 读取本地文件转成临时路径 (这是关键！)
//       const fileContent = fs.readFileSync(localPath, 'base64');
//       const tempPath = `data:image/jpg;base64,${fileContent}`;

//       // 4. 调用原生预览（此时用的是base64临时路径，必能加载）
//     //   wx.previewImage({
//     //     current: tempPath,
//     //     urls: [tempPath],
//     //     fail: (err) => {
//     //       console.error('预览失败', err);
//     //       wx.showToast({ title: '图片加载失败', icon: 'none' });
//     //     }
//     //   });

//   wx.previewImage({
//     current: cloudUrl,
//     urls: [cloudUrl],
//     fail: (err) => {
//       console.error("预览失败", err);
//     }
//   });
//     } catch (e) {
//       // 捕获错误：99%是路径写错了
//       wx.showToast({
//         title: `图片不存在: ${localPath}`,
//         icon: 'none',
//         duration: 3000
//       });
//       console.error('文件读取失败，请检查路径：', e);
//     }
//   },
  // 点击上传按钮调用
  
  previewMap() {
    console.log("✅ 点击预览地图");
    const realCloudUrl = "cloud://cloud1-2gp5ez590981c671.636c-cloud1-2gp5ez590981c671-1383410318/map/new_map.png";

    wx.cloud.getTempFileURL({
      fileList: [realCloudUrl],
      success: (res) => {
        const tempUrl = res.fileList[0].tempFileURL;
        console.log("✅ 临时预览地址：", tempUrl);

        wx.previewImage({
          current: tempUrl,
          urls: [tempUrl],
          success: () => {
            console.log("✅ 预览成功！");
          },
          fail: (err) => {
            console.error("❌ 预览失败：", err);
          }
        });
      },
      fail: (err) => {
        console.error("❌ 获取临时地址失败：", err);
      }
    });
  },


  // 获取云图片临时地址（给页面显示用）
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
