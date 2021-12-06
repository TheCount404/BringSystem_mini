// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: wx.getStorageSync('userinfo'),
    photoPath:"",
  },
  getToExplain(){
    wx.reLaunch({
      url: '../explain/explain',
    })
  },
  checkResult(){
    wx.reLaunch({
      url: '../explain/explain',
    })
  },
  takePhoto(){
    var that=this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        console.log(tempFilePaths)
        that.setData({
          photoPath:tempFilePaths
        })
        var result = that.data.photoPath.substring(that.data.photoPath.lastIndexOf('.') + 1)
        console.log("result="+result)
        // 百度通用物体和场景识别api支持jpg/png/bmp格式
        that.base64({
          url:that.data.photoPath,
          type:result
      }).then(res=>{
        var image_base64 =res.substring(res.lastIndexOf('base64,') + 7);//res是base64路径
          console.log(image_base64)
          wx.request({
            url: 'https://www.iiiambatman.top:7777/photo',
            data: {
              base64: image_base64,
              type:result
              },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success (res) {
              console.log("结果为",JSON.parse(res.data.data.result) );
              wx.setStorageSync('final_result',JSON.parse(res.data.data.result) )
              // 展示结果
              wx.showModal({
                title: '识别完成，查看结果',
                confirmText: "确定",
                showCancel: "取消",
                success: function (res) {
                  if (res.confirm) {
                    //点击确定按钮
                    wx.reLaunch({
                      url: '../detail/detail',
                    })
                  } else {
                    //点击取消按钮
                  }
                }
              })
            },
            fail: function (res) {
              console.log(res);
              wx.showModal({
                title: '访问失败',
                confirmText: "确定",
                showCancel: false,
              })
            }
          })
      })
      }
    })
  },
//转化图片
base64({url,type}){
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: url, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => {
        resolve('data:image/' + type.toLocaleLowerCase() + ';base64,' + res.data)
      },
      fail: res => reject(res.errMsg)
    })
  })
},
  // 事件处理函数
  bindViewTap() {
    console.log("跳转到说明页")
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    console.log(wx.getStorageSync('userinfo'))
    if(!wx.getStorageSync('userinfo')){
      wx.reLaunch({
        url: '../explain/explain',
      })
    }
  },
    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
