// pages/index/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取banner
    let bannerListData = await request('banner', { type: 2 })
    this.setData({
      bannerList: bannerListData.banners
    });
    // 获取推荐歌曲
    let recommendListData = await request('personalized')
    this.setData({
      recommendList: recommendListData.result
    })

    // 获取排行榜
    let index = 0
    let topListData = []
    let descriptions = [
      "最新歌曲榜单",
      "每日更新",
      "优秀原创作品",
      "全网用户都在听",
      "最佳国电在此",
      "英国UK排行榜"
    ]
    let ids=[3779629,19723756,2884035,3778678,10520166,180106]
    while (index < 6) {
      let result = await request('playlist/detail', { id: ids[index++] })
      topListData.push({
        name: result.playlist.name,
        description: descriptions[index - 1],
        tracks: result.playlist.tracks.slice(0, 3)
      })
    }
    // 排行榜音乐作者名字
    let authorNum=0
    let authors=''
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++){
        while(topListData[i].tracks[j].ar[authorNum]){
          if(authorNum!==0){
            authors+='/'
          }
          authors+=topListData[i].tracks[j].ar[authorNum].name
          authorNum++
        }
        topListData[i].tracks[j].ars=authors
        authorNum=0
        authors=''
      }
    }
    this.setData({
      topList: topListData
    })
  },

  // 跳转每日推荐
  toRecommendSongs(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSongs/recommendSongs',
    })
  },

  // 跳转至other页面
  toOther(){
    wx.navigateTo({
      url: '/otherPackage/pages/other/other'
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