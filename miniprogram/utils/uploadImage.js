// <<<<<<< HEAD
// // 空文件，只为解决编译报错
// module.exports = {}
// =======
// utils/uploadImage.js
/**
 * 单张图片上传工具函数
 * @param {Function} callback 上传完成后的回调函数（接收fileID）
 */
function uploadSingleImage(callback) {
  // 1. 选择图片
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    sizeType: ['compressed'],
    success: (chooseRes) => {
      const tempFilePath = chooseRes.tempFiles[0].tempFilePath;
      wx.showLoading({ title: '上传中...' });

      // 2. 生成唯一文件名
      const cloudFileName = 'goods/' + Date.now() + '-' + Math.random().toString(36).substr(2, 8) + '.png';

      // 3. 上传到云存储
      wx.cloud.uploadFile({
        cloudPath: cloudFileName,
        filePath: tempFilePath,
        success: (uploadRes) => {
          const fileID = uploadRes.fileID;
          // 4. 调用云函数存入数据库
          wx.cloud.callFunction({
            name: 'saveImageToDB',
            data: { imageUrl: fileID },
            success: (callRes) => {
              wx.hideLoading();
              if (callRes.result._id) {
                wx.showToast({ title: '上传成功！', icon: 'success' });
                callback && callback(fileID); // 执行回调，返回fileID
              } else {
                wx.showToast({ title: '保存数据库失败', icon: 'none' });
                callback && callback(null);
              }
            },
            fail: (callErr) => {
              wx.hideLoading();
              wx.showToast({ title: '调用云函数失败', icon: 'none' });
              callback && callback(null);
            }
          });
        },
        fail: (uploadErr) => {
          wx.hideLoading();
          wx.showToast({ title: '上传云存储失败', icon: 'none' });
          callback && callback(null);
        }
      });
    },
    fail: (chooseErr) => {
      wx.showToast({ title: '选择图片失败', icon: 'none' });
      callback && callback(null);
    }
  });
}

// 暴露方法，供其他页面调用
module.exports = {
  uploadSingleImage
};
// >>>>>>> ccb2b241ae8401190513d46d5ee7f7688be99e6a
