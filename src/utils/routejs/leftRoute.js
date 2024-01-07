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
	console.info('skyline: routeType left')
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
    const transY = screenWidth * (1 - t) 
		return {
			borderRadius: '10px',
			width: `${screenWidth}px`,
			transform: `translateX(${transY}px)`,
			opacity: t
		}
  }
  
  const handlePreviousPageAnimation = () => {
    'worklet'
    let lt = primaryAnimation.value
    if (!userGestureInProgress.value) {
      lt = _curvePrimaryAnimation.value
    }

    const brightness = 1 + (prevPageBrightness - 1) * lt
    let transX = screenWidth * lt
    let scale = 1
    const pageWidth = screenWidth * (1- wx.skyRoutePageWidth / 100)

    if(transX <= pageWidth){
      transX = 0
      scale = 1
    }else{
      scale = 1 - lt / 10
      transX -= pageWidth

    }
    transX = transX < 0 ? 0 : transX
    return {
      overflow: 'hidden',
      filter: `brightness(${brightness})`,
      borderRadius: `${topRadius}px`,
      transformOrigin: 'right',
      transform: `translateX(${-transX}px) scale(${scale})`,
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
    canTransitionFrom:  wx.skyFromPageAnimation,
    // 页面进入时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
    allowEnterRouteSnapshotting: true,
    // 页面退出时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
    allowExitRouteSnapshotting: true,
	}
}


function leftRouteBuilder() { 
  wx.router.addRouteBuilder('leftRoute',RouteBuilder)
}
export default leftRouteBuilder

