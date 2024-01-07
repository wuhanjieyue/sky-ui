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

const canHorsroutes = ['leftRoute','rightRoute']

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
            this.canHors.value = canHorsroutes.indexOf(wx.skyRouteType) >= 0
           
            this.childHeight.value = screenHeight * this.pageHeight.value /100

        })
      },
      detached(){
        wx.pageScale.value = timing(1,{
            duration: 300
        })
          wx.pageTrans.value = timing(0,{
            duration: 300
        })
        wx.skyPushScale = null
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

    tapmask(){
        if(getCurrentPages().length <= 1){
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }else{
          wx.navigateBack()
        }
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
        const lt = primaryAnimation.value
        let scale = 1
        let transX = screenWidth * lt
        const pageWidth = screenWidth * (1- this.pageWidth.value / 100)
        if(transX <= pageWidth){
          transX = 0
          scale = 1
        }else{
          scale = 1 - lt / 10
          transX -= pageWidth
        }
        transX = transX < 0 ? 0 : transX
        if(wx.skyPushScale){
          wx.pageScale.value = scale
          wx.pageTrans.value = transX
        }
  

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
            if(wx.skyPushScale){
              wx.pageScale.value = timing(0.9,{
                duration: droppedPageForwardAnimationTime,
                easing: animationCurve,
              })
                wx.pageTrans.value = timing(screenWidth * this.pageWidth.value /100,{
                  duration: droppedPageForwardAnimationTime,
                  easing: animationCurve,
              })
            }

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
            if(wx.skyPushScale){
              wx.pageScale.value = timing(1,{
                duration: droppedPageBackAnimationTime
              })
                wx.pageTrans.value = timing(0,{
                  duration: droppedPageBackAnimationTime
              })
            }

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

    

  }
})