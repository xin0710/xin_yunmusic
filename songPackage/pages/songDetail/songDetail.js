// pages/songDetail/songDetail.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js'
let backgroundAudioManager=wx.getBackgroundAudioManager();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    //播放模式 1列表播放 2列表循环 3单曲循环 4随机播放
    model:2,
    musicDetail:{},
    musicUrl:'',
    nowTime:'00:00',
    allTime:'00:00',
    max:0,
    audioTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获取歌曲详情
    await this.getMusciDetail(options.musicId,options.musicArs)
    // 获取播放地址
    await this.getMusicUrl(options.musicId)
    // 播放歌曲
    this.playMusic()
    // 设置播放状态
    if(app.globalData.isPlay && app.globalData.musicId===options.musicId){
      this.setData({
        isPlay:true
      })
    }
    // 歌曲切换监听
    PubSub.subscribe('newMusic',async (_,data)=>{
      // 获取歌曲详情
      await this.getMusciDetail(data.musicId,data.musicArs)
      // 获取播放地址
      await this.getMusicUrl(data.musicId)
      
      backgroundAudioManager.src=this.data.musicUrl
      backgroundAudioManager.title=this.data.musicDetail[0].al.name
      backgroundAudioManager.play()
      this.changePlayState(true)
    })

    // 歌曲播放调用
    backgroundAudioManager.onPlay(()=>{
      this.changePlayState(true)
      app.globalData.musicId=options.musicId
    })
    // 歌曲暂停调用
    backgroundAudioManager.onPause(()=>{
      this.changePlayState(false)
    })
    // 歌曲结束调用
    backgroundAudioManager.onEnded(()=>{
      // this.changePlayState(false)
      this.switchMusic()
    })
    // 歌曲停止调用
    backgroundAudioManager.onStop(()=>{
      this.changePlayState(false)
    })

    // 监听音乐时间改变
    backgroundAudioManager.onTimeUpdate(()=>{
      let nowTime=this.timeFormat(backgroundAudioManager.currentTime*1000);
      this.setData({
        nowTime,
        audioTime:parseInt(backgroundAudioManager.currentTime)
      })
    })
  },
  // 更改播放状态
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    app.globalData.isPlay=isPlay
  },
  // 歌曲的播放暂停
  playMusic(){
    this.changePlayState(!this.data.isPlay)
    backgroundAudioManager.src=this.data.musicUrl
    backgroundAudioManager.title=this.data.musicDetail[0].al.name
    if(this.data.isPlay){
      backgroundAudioManager.play()
    }else{
      backgroundAudioManager.pause()
    }
  },

  // 切换播放模式
  changeModel(){
    let model=this.data.model
    if(model===4){
      model=1
    }else{
      model++
    }
    this.setData({
      model
    })
  },
  // 获取歌曲详情
  async getMusciDetail(musicId,musicArs){
    let {songs:musicDetail}=await request('song/detail',{ids:musicId})
    musicDetail[0].ars=musicArs
    this.setData({
      musicDetail
    })
    wx.setNavigationBarTitle({
      title: this.data.musicDetail[0].al.name,
    })
  },
  // 获取播放地址
  async getMusicUrl(musicId){
    let musicUrlData = await request('song/url',{id:musicId})
    let allTime=this.timeFormat(musicUrlData.data[0].time)
    this.setData({
      musicUrl:musicUrlData.data[0].url,
      allTime,
      nowTime:'00:00',
      max:parseInt(musicUrlData.data[0].time/1000)
    })
  },

  // 上一首/下一首
  switchMusic(e){
    let type
    if(e){
      type=e.currentTarget.id
    }else{
      type='next'
    }
    PubSub.publish('switchMusic',type)
  },
  // 时间格式化
  timeFormat(time){
    let m=parseInt(time/1000/60)
    let s=parseInt(time/1000%60)
    if(m<10){
      m='0'+m
    }
    if(s<10){
      s='0'+s
    }
    return m+':'+s
  },
  sliderChange(e){
    backgroundAudioManager.seek(e.detail.value);
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