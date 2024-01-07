import {
	CurveAnimation,
	Curves
} from './util'
let app = getApp()

let screenHeight = 0 ; 
if(app.globalData.sky_system.screenHeight){
  screenHeight = app.globalData.sky_system.screenHeight 
}else{
  const systemInfo = wx.getSystemInfoSync()
  app.globalData.sky_system = systemInfo
  screenHeight= systemInfo.screenHeight
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
	console.info('skyline: routeType up')
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
		// 自底向上显示页面
    const transY = screenHeight * (1 - t) 
		return {
			borderRadius: '10px',
			height: `${screenHeight}px`,
			transform: `translateY(${transY}px)`,
			opacity: t
		}
  }
  
  const handlePreviousPageAnimation = () => {
    'worklet'
    let lt = primaryAnimation.value
    if (!userGestureInProgress.value) {
      lt = _curvePrimaryAnimation.value
    }
    const scale = 1 - lt / 10
    const brightness = 1 + (prevPageBrightness - 1) * lt
    const transY = prevPageTop * lt
    return {
      overflow: 'hidden',
      filter: `brightness(${brightness})`,
      borderRadius: `${topRadius}px ${topRadius}px 0px 0px`,
      transformOrigin: 'top ',
      transform: `translateY(${ transY }px) scale(${scale})`,
    }

  }
	return {
		opaque: false,
    handlePrimaryAnimation,
    handlePreviousPageAnimation,
		transitionDuration: wx.skyRouteDuration,
		reverseTransitionDuration: wx.skyRouteDuration,
		barrierColor: `rgba(0,0,0,${wx.skyRoutePageMask}%)`,
		barrierDismissible:true,
		canTransitionTo: true,
    canTransitionFrom: wx.skyFromPageAnimation,
    // 页面进入时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
    allowEnterRouteSnapshotting: true,
    // 页面退出时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
    allowExitRouteSnapshotting: true,
	}
}


function upRouteBuilder() { 
  wx.router.addRouteBuilder('upRoute',RouteBuilder)
}
export default upRouteBuilder

