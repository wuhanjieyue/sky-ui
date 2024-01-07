// components/sky-halfpage/sky-halfpage.js
import {
  GestureState,
  lerp,
  clamp,
  Curves,
  bottomSheetSuspendedCurve,
} from '../utils/routejs/util'

const {
  timing,
  shared
} = wx.worklet

const _minFlingVelocity = 500
const _closeProgressThreshold = 0.6
const canVersroutes = ['upRoute','downRoute']
const canHorsroutes = ['leftRoute','rightRoute']
const canPopsroutes = ['popRoute']

let app = getApp()
let screenWidth = 0 ; 
let screenHeight = 0;
if(app.globalData.sky_system.screenWidth){
  screenWidth = app.globalData.sky_system.screenWidth 
  screenHeight = app.globalData.sky_system.screenHeight 

}else{
  const systemInfo = wx.getSystemInfoSync()
  app.globalData.sky_system = systemInfo
  screenWidth= systemInfo.screenWidth
  screenHeight= systemInfo.screenHeight
}
Component({

  /**
   * 组件的属性列表
   */
  properties: {
  },

  lifetimes:{
      created(){
        this.initSharedValue()
      },
      attached(){
        this.applyAnimatedStyle('.container', () => {
            'worklet'
            return { height: `${this.pageHeight.value}vh`,width:`${this.pageWidth.value}vw` }
        })

        this.setData({routeType:wx.skyRouteType})
        wx.nextTick(()=>{
          if(wx.skyRouteType == 'popRoute'){
            this.applyAnimatedStyle('.popRoute', () => {
                'worklet'
                return {transform: `scale(${this.pageScale.value})` }
            })
          }
          this.pageHeight.value = wx.skyRoutePageHeight ? wx.skyRoutePageHeight : 100
          this.pageWidth.value = wx.skyRoutePageWidth ? wx.skyRoutePageWidth : 100

          this.skyRouteDuration.value = wx.skyRouteDuration
          this.skyRouteType.value = wx.skyRouteType
            this.skyDisableDrag.value = wx.skyDisableDrag
            this.canVers.value = canVersroutes.indexOf(wx.skyRouteType) >= 0
            this.canHors.value = canHorsroutes.indexOf(wx.skyRouteType) >= 0
            this.canPops.value = canPopsroutes.indexOf(wx.skyRouteType) >= 0
            if(this.canPops.value){
              this.pageScale.value = timing(1,{duration:this.skyRouteDuration.value})
            }
            this.childHeight.value = screenHeight * this.pageHeight.value /100

            // this.getChildHeight()

        })
      },
      detached(){
        if(this.skyRouteDuration.value  == 'popRoute'){
          this.pageScale.value = timing(0,{duration:this.skyRouteDuration.value})
        }
        wx.router.removeRouteBuilder(this.data.routeType)
      }
  },
  /**
   * 组件的初始数据
   */
  data: {
    routeType:'upRoute'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initSharedValue() {

      this.customRouteContext = wx.router.getRouteContext(this) || {};
      this.pageHeight = shared(0)
      this.pageWidth = shared(0)
      this.pageRadius = shared(0)
      // poproute时，元素缩放
      this.pageScale = shared(0)
      
      this.childHeight = shared(0)
      this.scrollTop = shared(506);
      // 用于优化右滑手势快速松开时判断退出页面与route.js中的退出冲突
      this.leftPrimaryAnimation = shared(0)
      this.startPan = shared(false);
      // route相关参数赋值
      this.skyRouteType = shared('upRoute')
      this.skyRouteDuration = shared(350)
      this.skyDisableDrag = shared(false)
      this.canHors = shared(false)
      this.canVers = shared(false)
      this.canPops = shared(false)
    },
    getChildHeight() {
      this.createSelectorQuery().select('.container').boundingClientRect((rect) => {
        "worklet"
        this.childHeight.value = rect.height
      }).exec()
    },
    tapmask(){
          this.triggerEvent('tapmask', {}, {})
      },

      shouldHorAccept(){
        'worklet';
        return (! this.skyDisableDrag.value) && this.canHors.value
      },
      shouldHorResponse(){
        'worklet';     
        // this.startPan.value = ! this.canHors.value
        return this.canHors.value
      },
      onSwipeBack(evt) {
        'worklet';
        if (evt.state === GestureState.BEGIN) {
            this.lrhandleDragStart();
        } else if (evt.state === GestureState.ACTIVE) {
            const delta = evt.deltaX / screenWidth ;
            this.lrhandleDragUpdate(delta);
        } else if (evt.state === GestureState.END) {
            const velocity = evt.velocityX / screenWidth;
            this.lrhandleDragEnd(velocity);
        } else if (evt.state === GestureState.CANCELLED) {
            this.lrhandleDragEnd(0.0);
        }
    },
    lrhandleDragStart() {
      'worklet'
      const {
          startUserGesture,
      } = this.customRouteContext;
      startUserGesture();
    },

    lrhandleDragUpdate(delta) {
        'worklet';
        const {
            primaryAnimation
        } = this.customRouteContext;
        let newVal = 0;
        if(this.skyRouteType.value == 'rightRoute'){
          newVal = primaryAnimation.value + delta
        }else if(this.skyRouteType.value == 'leftRoute'){
          newVal = primaryAnimation.value - delta
        }
        primaryAnimation.value = clamp(newVal, 0.0, 1.0);
        this.leftPrimaryAnimation.value = primaryAnimation.value
    },

    lrhandleDragEnd(velocity) {
        'worklet';
        const {
            primaryAnimation,
            stopUserGesture,
            didPop
        } = this.customRouteContext;

        let animateForward = false;
        if (Math.abs(velocity) >= 1.0) {
            if(this.skyRouteType.value == 'rightRoute'){
              animateForward = velocity >= 0;

            }else if(this.skyRouteType.value == 'leftRoute'){
              animateForward = velocity <= 0;
            }
        } else {
            animateForward = primaryAnimation.value > (1 - this.pageWidth.value /200);
        }
        const t = primaryAnimation.value;
        const animationCurve = Curves.fastLinearToSlowEaseIn;
        if (animateForward) {
            const droppedPageForwardAnimationTime = Math.min(
                Math.floor(lerp(300, 0, t)),
                300,
            );
            primaryAnimation.value = timing(
                1.0, {
                    duration: droppedPageForwardAnimationTime,
                    easing: animationCurve,
                },
                () => {
                    'worklet'
                    stopUserGesture();
                },
            );
        } else {
            const droppedPageBackAnimationTime = Math.floor(lerp(0, 300, t));
            primaryAnimation.value = timing(
              this.leftPrimaryAnimation.value, {
                    duration: droppedPageBackAnimationTime,
                    easing: animationCurve,
                },
                () => {
                    'worklet'
                    stopUserGesture();
                    didPop()
                },
            );
        }
    },

    shouldPanResponse() {
      'worklet';
      return (! this.skyDisableDrag.value ) && this.canVers.value
    },
    shouldVerAccept(){
      'worklet';
        return (! this.skyDisableDrag.value ) && this.canVers.value
    },
    handleVerticalDrag(evt) {
      'worklet';
      if (evt.state === GestureState.BEGIN) {
        this.handleDragStart();
        
      } else if (evt.state === GestureState.ACTIVE) {
        const delta = evt.deltaY / this.childHeight.value;
        this.handleDragUpdate(delta);
      } else if (evt.state === GestureState.END) {
        const velocity = evt.velocityY;
        this.handleDragEnd(velocity);
      } else if (evt.state === GestureState.CANCELLED) {
        this.handleDragEnd(0.0);
      }
    },
    handleDragStart() {
      'worklet';
      this.startPan.value = true;
      const {
        startUserGesture
      } = this.customRouteContext;
      startUserGesture();
    },
    
    handleDragUpdate(delta) {
      'worklet';
      const {
        primaryAnimation
      } = this.customRouteContext;
      if(this.skyRouteType.value == 'upRoute'){
        const newVal = primaryAnimation.value - delta;
        primaryAnimation.value = clamp(newVal, 0.0, 1.0);
        this.leftPrimaryAnimation.value = primaryAnimation.value
      }else if(this.skyRouteType.value == 'downRoute'){
        const newVal = primaryAnimation.value + delta;
        primaryAnimation.value = clamp(newVal, 0.0, 1.0);
        this.leftPrimaryAnimation.value = primaryAnimation.value
      }

     
    },
  
    handleDragEnd(velocity) {
      'worklet';
      this.startPan.value = false;
      const {
        primaryAnimation,
        stopUserGesture,
        userGestureInProgress,
        didPop
      } = this.customRouteContext;
  
      if (!userGestureInProgress.value) return
  
      let animateForward = false;
      if (Math.abs(velocity) >= _minFlingVelocity) {
        animateForward = velocity <= 0;
      } else {
        animateForward = primaryAnimation.value > _closeProgressThreshold;
      }
      const t = primaryAnimation.value;
      const animationCurve = bottomSheetSuspendedCurve(t, Curves.decelerateEasing)

      if (animateForward) {
        const remainingFraction = 1.0 - t
        const simulationDuration = this.skyRouteDuration.value * remainingFraction 
    
        primaryAnimation.value = timing(
          1.0, {
          duration: simulationDuration,
          easing: animationCurve,
        },
          () => {
            'worklet'
            stopUserGesture();
          },
        );
      } else {
        // TODO: 结合松手时的速度作 spring 动画
        const remainingFraction = t
        const simulationDuration = this.skyRouteDuration.value * remainingFraction 
        const animationCurve = Curves.easeOutCubic;
  
        primaryAnimation.value = timing(
          this.leftPrimaryAnimation.value , {
          duration: simulationDuration,
          easing: animationCurve,
        },
          () => {
            'worklet'
            stopUserGesture();
            didPop();
          },
        );
      }
    },

  }
})