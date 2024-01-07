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

const RouteBuilder = (customRouteContext) => {
	console.info('skyline: routeType pop')
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
		return {
			borderRadius: '10px',
      height: `${screenHeight}px`,
			opacity: t
		}
  }

	return {
		opaque: false,
    handlePrimaryAnimation,
		transitionDuration: 50,
		reverseTransitionDuration: wx.skyRouteDuration,
		barrierColor: `rgba(0,0,0,${wx.skyRoutePageMask}%)`,
		barrierDismissible:true,
		canTransitionTo: true,
    canTransitionFrom: false,
    // 页面进入时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
    allowEnterRouteSnapshotting: true,
    // 页面退出时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
    allowExitRouteSnapshotting: true,
	}
}


function popRouteBuilder() { 
  wx.router.addRouteBuilder('popRoute',RouteBuilder)
}

export default popRouteBuilder

