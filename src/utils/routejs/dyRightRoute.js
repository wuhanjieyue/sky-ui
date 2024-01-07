import {
	CurveAnimation,
	Curves
} from './util'
let app = getApp()

let screenWidth = 0 ; 
if(app.globalData.sky_system.screenWidth){
  screenWidth = app.globalData.sky_system.screenWidth 
}else{
  const systemInfo = wx.getSystemInfoSync()
  app.globalData.sky_system = systemInfo
  screenWidth= systemInfo.screenWidth
}
const prevPageBrightness = 0.9
const topRadius = 12

let prevPageTop = 2
if(app.globalData.sky_menu.bottom){
  prevPageTop += app.globalData.sky_menu.bottom
}else{
  const menuRect = wx.getMenuButtonBoundingClientRect()
  app.globalData.sky_menu = menuRect
  prevPageTop += menuRect.bottom
}

const RouteBuilder = (customRouteContext) => {
	console.info('skyline: routeType right')
	const {
		primaryAnimation,
		primaryAnimationStatus,
		userGestureInProgress,
	} = customRouteContext

	const _curvePrimaryAnimation = CurveAnimation({
		animation: primaryAnimation,
		animationStatus: primaryAnimationStatus,
		curve: Curves.linearToEaseOut,
		reverseCurve: Curves.easeInToLinear,
	})
	/**
	 * 1. 手势拖动时采用原始值
	 * 2. 页面进入时采用 curve 曲线生成的值
	 * 3. 页面返回时采用 reverseCurve 生成的值
	 */
	const handlePrimaryAnimation = () => {
    'worklet'
		let t = primaryAnimation.value
		if (!userGestureInProgress.value) {
			t = _curvePrimaryAnimation.value
    }
    let transX = screenWidth * (1 - t) 
		return {
			borderRadius: '10px',
      width: `${screenWidth}px`,
      transform: `translateX(${-transX}px)`,
      opacity : primaryAnimationStatus.value == 3 ? 1 : 0
      // opacity:t > 0.9 ? t : 0

		}
  }
  
  

	return {
		opaque: false,
    handlePrimaryAnimation,
		transitionDuration: 150,
		reverseTransitionDuration: 350,
		barrierColor: `rgba(0,0,0,${wx.skyRoutePageMask}%)`,
		barrierDismissible:true,
		canTransitionTo: true,
    canTransitionFrom:  false,
    // 页面进入时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
    allowEnterRouteSnapshotting: true,
    // 页面退出时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
    allowExitRouteSnapshotting: true,
	}
}


function dyRouteBuilder() { 
  wx.router.addRouteBuilder('dyRoute',RouteBuilder)
}
export default dyRouteBuilder

