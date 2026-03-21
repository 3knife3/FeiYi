// pages/my/my.js
Page({
    data: {
      userInfo:{
          avatar:'/images/banner/banner1.png',
          name:'DaChuang',
          score:'10000'
      },
      showContact:false
    },

    goToOrder(){
        wx.navigateTo({
          url: '/pages/order/order',
        })
    },

    showContact(){
        this.setData({
            showContact:true
        })
    },
    onConfirm(){
        this.setData({
            showContact:false
        })
    }
  })