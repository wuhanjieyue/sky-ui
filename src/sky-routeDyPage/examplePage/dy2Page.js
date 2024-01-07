const getList = (num) => {
  const ans = []
  for (let i = 0; i < num; i++) {
    ans.push({
      id: i
    })
  }
  return ans
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:getList(40)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
      return {
        title:"仿抖音路由 DY2PAGE",
        path:"pages/dy2Page/dy2Page"
      }
  },
  backPage(){
    if(getCurrentPages().length <= 1){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }else{
      wx.navigateBack()
    }
  },
  gotoLeft(){
    wx.SkyUtils.skyNavigate({
      pageWidth:70,
      pageMask:0,
      routeDuration:550,
      fromPageAnimation:true,
      url: './dyLeftPage',
      routeType:'rightRoute'
    })
  }
})