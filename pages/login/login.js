// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrimg:'',
    // phone:'',
    // password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  //qrcode.js
  //检测扫码状态接口
  async checkStatus(key) {
    let result = await request(`login/qr/check?key=${key}&timestamp=${Date.now()}`,)
    console.log(result, 'checkStatus');
    return result
  },

  //获取登录状态的函数 需要的参数（cooike（由上一个函数请求返回），请求方式：post）
  //本人在这个函数里头没有调用上面自己封装好的请求函数，因为自己也不会，尝试了一晚上也不能返回到用户信息，如果有大佬能发现问题，请务必告诉！！！
  async getLoginStatus(cookie = ''){
    console.log(cookie,'cookie');
    return new Promise((resolve,reject)=>{
      wx.request({
        url:`http://localhost:3000/login/status?timestamp=${Date.now()}`,
        method: 'get',
        data: {
          cookie,
        },
        success:(res)=>{
          console.log('请求成功',res.data.data.profile);
          resolve(res.data)
          //data里面的profile就是用户信息存储的信息。
          wx.setStorageSync('userInfo', JSON.stringify(res.data.data.profile))
        },
        fail:(err)=>{
          console.log('请求失败',err);
          reject(err)
        }
      })
    })
  },

  //这里你也可以用其他生命函数钩子去触发，本人比较希望通过绑定点击事件
  async qrlogin() {
    //获取key
    let reskey = await request(`login/qr/key?timestamp=${Date.now()}`)
    //console.log(this.data.unikey,'unikey');

    //获取二维码
    let result2 = await request(`login/qr/create?key=${reskey.data.unikey}&qrimg=true&timestamp=${Date.now()}`)
    //console.log(result2,'qrlogin');
    //存下二维码
    this.setData({
      qrimg: result2.data.qrimg
    })

    let timer
    let timestamp = Date.now()
    //定时器查看
    timer = setInterval(async () => {
      //调用检测扫码状态接口
      const result3 = await this.checkStatus(reskey.data.unikey)
      console.log(result3, '3');

      if (result3.code === 800) {
        wx.showToast({
          title: '二维码已过期,请重新获取',
        })
        clearInterval(timer)
      }
      if (result3.code === 803) {
        // 这一步会返回cookie
        wx.showToast({
          title: '授权登录成功',
        })
        clearInterval(timer)
        //成功获取到cooike，回到前面的函数请求获取用户信息。
        await this.getLoginStatus(result3.cookie)

        //登录成功跳转到个人页面
        wx.reLaunch({
          url:'/pages/personal/personal'
        })
      }
    }, 3000)

  },
  
  // handleValue(e){
  //   let type=e.currentTarget.dataset.type
  //   let value=e.detail.value
  //   this.setData({
  //     [type]:value
  //   })
  // },
  // async login(){
  //   wx.showToast({
  //     title: '登陆中...',
  //     icon:'loading'
  //   })
  //   let{phone,password}=this.data
  //   if(!phone){
  //     wx.showToast({
  //       title: '手机号不能为空',
  //       icon:'error'
  //     })
  //     return
  //   }
  //   let phoneReg=/^1[3456789]\d{9}$/
  //   if(!phoneReg.test(phone)){
  //     wx.showToast({
  //       title: '手机号格式错误',
  //       icon:'error'
  //     })
  //     return
  //   }
  //   if(!password){
  //     wx.showToast({
  //       title: '密码不能为空',
  //       icon:'error'
  //     })
  //     return
  //   }
  //   let result=await request('login/cellphone',{phone,password,isLogin:true})
  //   if(result.code===200){
  //     wx.showToast({
  //       title: '登陆成功',
  //       icon:'success'
  //     })
  //     wx.setStorageSync('userInfo', JSON.stringify(result.profile))
  //     wx.reLaunch({
  //       url: '/pages/personal/personal',
  //     })
  //   }else if(result.code===502||result.code===501){
  //     wx.showToast({
  //       title: '账号或密码错误',
  //       icon:'error'
  //     })
  //   }else{
  //     wx.showToast({
  //       title: '请稍后再试',
  //       icon:'error'
  //     })
  //   }
  // },

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