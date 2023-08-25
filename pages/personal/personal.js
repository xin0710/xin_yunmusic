import request from '../../utils/request'
let startY=0
let moveY=0
let translateY=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'',
    coverTransition:'',
    userInfo:{},
    userRecentPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo=JSON.parse(wx.getStorageSync('userInfo'))
    if(userInfo){
      this.setData({
        userInfo
      })
    }
    this.getUserRecentPlayList(userInfo.userId)
  },
  // 获取最近播放
  async getUserRecentPlayList(userId){
    let userRecentPlayListData=await request('user/record',{uid:userId,type:0})
    let recentPlayList=userRecentPlayListData.allData.splice(0,10).map(item=>{
      item.id=item.song.id
      return item
    })
    this.setData({
      userRecentPlayList:recentPlayList
    })
  },

  // 跳转登录界面
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 会员框架拉出
  handleTouchStart(e){
    startY=e.touches[0].clientY
    this.setData({
      coverTransition:''
    })
  },
  handleTouchMove(e){
    moveY=e.touches[0].clientY
    translateY=moveY-startY
    if(translateY<=0) return
    if(translateY>=80){
      translateY=80
    }
    this.setData({
      coverTransform:`translateY(${translateY}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform:`translateY(0rpx)`,
      coverTransition: "transform 1s linear"
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})