// pages/search/search.js
import request from '../../utils/request'
let searchValve=false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchDefault:'',
    topList:[],
    searchContext:'',
    searchList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSearchDefault()
    this.getTopList()
  },
  // 获取默认搜索词
  async getSearchDefault(){
    let {data:key} = await request('search/default')
    this.setData({
      searchDefault:key.showKeyword
    })
  },

  // 获取热搜列表
  async getTopList(){
    let {data:topListData}= await request('search/hot/detail')
    this.setData({
      topList:topListData
    })
  },

  // 获取用户输入内容
  getSearchInput(e){
    let searchContext = e.detail.value.trim()
    this.setData({
      searchContext
    })

    if(searchValve){
      return
    }
    searchValve=true
    setTimeout(() => {
      searchValve=false
    }, 1000);
    this.getSearchList()
  },

  // 获取搜索列表
  async getSearchList(){
    let searchListData=await request('search',{keywords:this.data.searchContext,limit:10})
    this.setData({
      searchList:searchListData.result.songs
    })
  },

  // 取消搜索
  cancelSearch(){
    this.setData({
      searchContext:'',
      searchList:[]
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