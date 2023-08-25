// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    selectedId: 0,
    videoList: [],
    videoId: '',
    videoTime: [],
    isRefreshed: false,
    offset: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupList()
  },

  // 获取视频标签列表
  async getVideoGroupList() {
    let videoGroupListData = await request('video/group/list')
    let result = videoGroupListData.data.slice(0, 10)
    this.setData({
      videoGroupList: result,
      selectedId: result[0].id
    })
    this.getVideoGroup(this.data.selectedId)
  },

  // 更改视频标签
  changeNav(e) {
    if (this.data.selectedId !== e.currentTarget.dataset.id) {
      this.setData({
        videoList: []
      })
    }
    this.setData({
      selectedId: e.currentTarget.dataset.id,
      offset: 0
    })
    wx.showLoading({
      title: '加载中...'
    })
    this.getVideoGroup(this.data.selectedId)
  },

  // 获取视频标签下的视频
  async getVideoGroup(id, offset = 0) {
    if (!id) return
    if(offset===0){
      this.setData({
        videoList:[]
      })
    }
    let result = await request('video/group', { id, offset })
    let oudVideoListData=this.data.videoList
    let newVideoListData = await Promise.all(result.datas.map(async item => {
      item.id = item.data.vid
      let result = await request('video/url', { id: item.id })
      item.url = result.urls[0].url
      return item
    }))
    wx.hideLoading()
    this.setData({
      videoList: [...oudVideoListData,...newVideoListData],
      isRefreshed: false
    })
  },

  // 视频播放/暂停
  handlePlay(e) {
    let id = e.currentTarget.id
    this.videoContext = wx.createVideoContext(id)
    this.setData({
      videoId: id
    })
    let videoTimeItemData = this.data.videoTime
    let videoItem = videoTimeItemData.find(item => item.id === id)
    if (videoItem) {
      this.videoContext.seek(videoItem.time)
    }
  },

  // 视频存储时长
  handleTimeUpdate(e) {
    let videoTimeObj = this.data.videoTime
    let videoTimeItemData = { id: e.currentTarget.id, time: e.detail.currentTime }
    let videoItem = videoTimeObj.find(item => item.id === e.currentTarget.id)
    if (videoItem) {
      videoItem.time = e.detail.currentTime
    } else {
      videoTimeObj.push(videoTimeItemData)
    }
    this.setData({
      videoTime: videoTimeObj
    })
  },

  // 结束播放重置时长
  handleEnded(e) {
    let videoTimeItemData = this.data.videoTime
    videoTimeItemData.splice(videoTimeItemData.findIndex(item => item.id === e.currentTarget.id), 1)
    this.setData({
      videoTime: videoTimeItemData
    })
  },

  // 下拉刷新
  refresherVideoList() {
    this.getVideoGroup(this.data.selectedId)
    this.setData({
      offset:0
    })
  },

  // 触底触发
  handleLower() {
    this.setData({
      offset:this.data.offset+1
    })
    this.getVideoGroup(this.data.selectedId,this.data.offset)
  },

  // 跳转搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
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
    return {
      title:'EMO MUSIC',
      path:'/pages/video/video'
    }
  }
})