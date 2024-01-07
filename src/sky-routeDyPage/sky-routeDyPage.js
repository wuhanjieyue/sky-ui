import dyRouteBuilder from '../utils/routejs/dyRightRoute'

const {
  timing,
  shared,
  runOnJS
} = wx.worklet

const GestureState = {
  POSSIBLE: 0,
  BEGIN: 1,
  ACTIVE: 2,
  END: 3,
  CANCELLED: 4,
}

function clamp(v, lower, upper) {
  'worklet'
  if (v < lower) return lower
  if (v > upper) return upper
  return v
}

let app = getApp()
let screenWidth = 0 ; 
if(app.globalData.sky_system.screenWidth){
  screenWidth = app.globalData.sky_system.screenWidth 
}else{
  const systemInfo = wx.getSystemInfoSync()
  app.globalData.sky_system = systemInfo
  screenWidth= systemInfo.screenWidth
}
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    leftPageWidth:{
      type:Number,
      value:70
    },
    leftUrl:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes:{
    created(){
      // 页面比例
      this.widthScale = shared(this.data.leftPageWidth)
      this.widthActual = shared(screenWidth * this.data.leftPageWidth /100)
      this.screenOpacity = shared(1)
      wx.pageTrans = shared(0)
      wx.pageScale = shared(1)
    },
    attached(){
      this.applyAnimatedStyle('.leftview', () => {
        'worklet'
        return { width: `${this.widthScale.value}vw`,transform: `translateX(${wx.pageTrans.value}px)` ,opacity:`${this.screenOpacity.value}`}
      })
      this.applyAnimatedStyle('.rightview', () => {
        'worklet'
        return { transform: `translateX(${wx.pageTrans.value}px) scale(${wx.pageScale.value}) `}
      })

      this.widthScale = shared(this.data.leftPageWidth)
      this.widthActual = shared(screenWidth * this.data.leftPageWidth /100)

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    shouldHorAccept(){
      'worklet';
      return true
    },
    shouldHorResponse(){
      'worklet';
      return true

    },
    onSwipeBack(evt){
      'worklet';
      if (evt.state === GestureState.BEGIN) {
          this.lrhandleDragStart();
      } else if (evt.state === GestureState.ACTIVE) {
          const delta = evt.deltaX  ;
          this.lrhandleDragUpdate(delta);
      } else if (evt.state === GestureState.END) {
          const velocity = evt.velocityX / this.widthActual.value;
          this.lrhandleDragEnd(velocity);
      } else if (evt.state === GestureState.CANCELLED) {
          this.lrhandleDragEnd(0.0);
      }
    },
    lrhandleDragStart() {
      'worklet'
    },

    lrhandleDragUpdate(delta) {
        'worklet';
        
        const newVal = wx.pageTrans.value + delta
        wx.pageTrans.value = clamp(newVal, 0.0, this.widthActual.value);
        wx.pageScale.value = 1 -  (wx.pageTrans.value / this.widthActual.value / 10)
    },

    lrhandleDragEnd(velocity) {
        'worklet';
        const durationTime = 350 * (1 - wx.pageTrans.value / this.widthActual.value)
        let animateForward = false;
        if (Math.abs(velocity) >= 1.0) {
            animateForward = velocity >= 0;
        } else {
            animateForward = wx.pageTrans.value > (this.widthActual.value / 2);
        }
        wx.pageTrans.value = timing(animateForward ? this.widthActual.value : 0 ,{duration:durationTime})
        wx.pageScale.value = timing(animateForward ? 0.9: 1,{duration:durationTime})

        if(animateForward){
          runOnJS(this.dyNavigate.bind(this))(durationTime)
        }else{
          runOnJS(this.closeLeftPage.bind(this))(durationTime)
        }

    },
    openLeftPage(){

    },
    closeLeftPage(){
      'worklet';

    },
    dyNavigate(durationTime){
      // 结束前计算当前页面的推入比例 
      wx.skyPushScale =   this.widthActual.value - wx.pageTrans.value
      wx.skyRoutePageHeight = 99.9
      wx.skyRoutePageWidth = this.data.leftPageWidth
      wx.skyRoutePageMask =  0
      wx.skyDisableDrag = false
      wx.skyFromPageAnimation = true
      wx.skyRouteType = 'rightRoute'
      setTimeout(() => {
      
        dyRouteBuilder()
        wx.navigateTo({
          url:this.data.leftUrl,
          routeType:"dyRoute"
        })
      }, durationTime)
    }
  }
})