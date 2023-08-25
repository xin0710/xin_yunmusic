// pages/recommendSongs/recommendSongs.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:0,
    day:0,
    songList:[],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.hasLogin()
    this.getDate()
    this.getSongList()
    PubSub.subscribe('switchMusic',(_,type)=>{
      // 切换歌曲列表中正在播放歌曲的下标
      let index=this.data.index
      if(type==='next'){
        if(index===29){
          index=0
        }else{
          index++
        }
      }else{
        if(index===0){
          index=29
        }else{
          index--
        }
      }
      this.setData({
        index
      })
      // 将新歌发送给歌曲详情页面
      PubSub.publish('newMusic',{
        musicId:this.data.songList[index].id,
        musicArs:this.data.songList[index].ars
      })
    })
  },

  // 获取日期
  getDate(){
    let time=new Date()
    let month=time.getMonth()+1
    let day=time.getDate()
    this.setData({
      month,
      day
    })
  },

  // 获取歌曲列表
  async getSongList(){
    let {data:res}=await request('recommend/songs')
    // 作者名字整理
    let authorNum=0
    let authors=''
    let songListData=res.dailySongs.map(item=>{
      while(item.ar[authorNum]){
        if(authorNum!==0){
          authors+='/'
        }
        authors+=item.ar[authorNum].name
        authorNum++
      }
      item.ars=authors
      authorNum=0
      authors=''
      return item
    })
    this.setData({
      songList:songListData
    })
  },
  hasLogin(){
    let userInfo=wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
  },
  // 跳转歌曲详情
  toSongDetail(e){
    let musicId=e.currentTarget.dataset.songid
    let musicArs=e.currentTarget.dataset.songars
    this.setData({
      index:e.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?musicId='+musicId+'&musicArs='+musicArs,
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