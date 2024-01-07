// 高级自定义页面，自带<scroll-view>,并且拥有手势互动功能
import myBehavior from './sky-routeAdvanceBehavior'
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
let screenHeight = 0 ;
if(app.globalData.sky_system.screenWidth){
  screenWidth = app.globalData.sky_system.screenWidth 
  screenHeight = app.globalData.sky_system.screenHeight 
}else{
  const systemInfo = wx.getSystemInfoSync()
  app.globalData.sky_system = systemInfo
  screenWidth= systemInfo.screenWidth
  screenHeight = systemInfo.screenHeight 
}
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  behaviors: [myBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    scrollClass:{
      type:String,
      value:''
    },
    scrollList:{
      type:Array,
      value:[]
    },
    key:{
      type:String,
      value:"index"
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultStartNode:'skystartnode',
    routeType:'upRoute',
  },

  lifetimes:{
    created(){
      this.initSharedValue()
    },
    attached(){
        this.setData({routeType:wx.skyRouteType})

          this.applyAnimatedStyle('.container', () => {
            'worklet'
            return { height: `${this.pageHeight.value}vh`,width:`${this.pageWidth.value}vw` }
          })

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
            this.skyDisableDrag.value = wx.skyDisableDrag
            this.skyRouteType.value = wx.skyRouteType
            this.canVers.value = canVersroutes.indexOf(wx.skyRouteType) >= 0
            this.canHors.value = canHorsroutes.indexOf(wx.skyRouteType) >= 0
            this.canPops.value = canPopsroutes.indexOf(wx.skyRouteType) >= 0
            if(this.canPops.value){
              this.pageScale.value = timing(1,{duration:this.skyRouteDuration.value})
            }
            // this.getChildHeight()
            this.childHeight.value = screenHeight * this.pageHeight.value /100
            console.log()

          })

    },
    ready(){
      setTimeout(() => {
        this._isReady = true
        this._scrollIntoViewChanged(this.data.scrollIntoView,this.data.defaultStartNode)
      }, wx.skyRouteDuration);

    },
    detached(){
        if(this.canPops.value){
          this.pageScale.value = timing(0,{duration:this.skyRouteDuration.value})
        }
        wx.router.removeRouteBuilder(this.data.routeType)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

    _scrollIntoViewChanged(newVal){
        if(this._isReady) {
            const ownerComponentQuery = this.selectOwnerComponent()
            ownerComponentQuery.createSelectorQuery().select('#'+newVal).boundingClientRect((rect) => {
              
              this.createSelectorQuery().select('#' + this.data.defaultStartNode).boundingClientRect((scr) => {
                this.setData({scrollTop:  rect.top  - scr.top + this.scrollTop.value})
              }).exec()
            }).exec()
        }
        
    },
  
    back() {
      wx.navigateBack({
        delta: 1,
      });
    },
  
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

    shouldPanResponse() {
      'worklet';
      return this.startPan.value 
    },
    shouldScrollViewResponse(pointerEvent) {
      'worklet';
      if(this.skyDisableDrag.value){
        return true
      }
      const {
        primaryAnimation
      } = this.customRouteContext;
      if (primaryAnimation.value < 1) return false;
      const scrollTop = this.scrollTop.value;
      const {
        deltaY
      } = pointerEvent;
      const result = !(scrollTop <= 0 && deltaY > 0);
      this.startPan.value = !result;
      return result;
    },

    // handleScroll(evt) {
    //   'worklet';
    //   this.scrollTop.value = evt.detail.scrollTop;
    // },
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
    shouldHorAccept(){
      'worklet';
      return (! this.skyDisableDrag.value) && this.canHors.value
    },
    shouldHorResponse(){
      'worklet';     
      this.startPan.value = ! this.canHors.value
      return this.canHors.value
    },
    shouldVerAccept(){
      'worklet';
        return (! this.skyDisableDrag.value ) && this.canVers.value
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
    }
  }
})