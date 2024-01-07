import getCssColor from '../utils/colors';
let screenWidth = 0
let app = getApp()
if(app.globalData.sky_system.screenWidth ){
  screenWidth = app.globalData.sky_system.screenWidth
}else{
  
  const systemInfo = wx.getSystemInfoSync()
  app.globalData.sky_system = systemInfo
  screenWidth = app.globalData.sky_system.screenWidth 
}
const {shared,timing} = wx.worklet
let durationTime = 300
Component({

  /**
   * 组件的属性列表
   */
  properties: {
      width:{
        type:Number,
        optionalTypes:[String],
        value:screenWidth*0.8
      },
      height:{
        type:Number,
        optionalTypes:[String],
        value:16
      },
      percent:{
        type:Number,
        optionalTypes:[String],
        value:0
      },
      animation:{
        type:Boolean,
        value:true
      },
      backgroundColor:{
        type:String,
        value:'var(--bg-l3)'
      },
      autoColor:{
        type:Boolean,
        value:false
      },
      color:{
        type:String,
        value:'var(--suc-l1)'
      },
      // 百分比数字显示位置 可选 hidden隐藏/start 开头/afterPer 跟随百分比/end 整个进度条结尾
      textPosition:{
        type:String,
        value:'hidden'
      },
      showStripe:{
        type:Boolean,
        value:false
      }
      
  },
  observers:{
    'backgroundColor,autoColor,color':function(backgroundColor,autoColor,color){
      if(this.readyFlag.value){
        this.setColor(backgroundColor,autoColor,color)
      }
    },
    'percent,width,height,showStripe':function(percent,width,height,showStripe){
        if(this.readyFlag.value){
          this.setSize(percent,width,height,showStripe)
        }
    },
    'animation':function(animation){
      if(this.readyFlag.value){
        durationTime = animation ? 300 : 0
      }
    },
    'textPosition':function(textPosition){
      if(this.readyFlag.value){
        this.setTextPosition(textPosition)
      }
    }
  },
  lifetimes:{
    created(){
        this.readyFlag = shared(false)
        this.lineHeight = shared(16)
        this.bgWidth = shared(screenWidth* 0.8)
        this.proWidth = shared(0)
        this.bgColor = shared('#c4c4c5')
        this.proColor = shared('#64BB5C')
        this.textLeft = shared(0)
        this.textScale = shared(1)
        this.stripeHeight = shared(0)
        this.acpre = 0
    },
    attached(){
      this.applyAnimatedStyle('.backview', () => {
        'worklet'
        return { width: `${this.bgWidth.value}px`,height: `${this.lineHeight.value}px`, backgroundColor:`${this.bgColor.value }`}
      })

      this.applyAnimatedStyle('.lineview', () => {
        'worklet'
        return { width: `${this.proWidth.value }px`,height: `${this.lineHeight.value}px`, backgroundColor:`${this.proColor.value }`}
      })

      this.applyAnimatedStyle('.textview', () => {
        'worklet'
        return { left: `${this.textLeft.value }px`,height: `${this.lineHeight.value}px`}
      })
      this.applyAnimatedStyle('.text', () => {
        'worklet'
        return { transform: `scale(${this.textScale.value})`,}
      })
      this.applyAnimatedStyle('.stripeview', () => {
        'worklet'
        return { height: `${this.stripeHeight.value}px`}
      })

      setTimeout(() => {
        durationTime = this.data.animation ? 350 : 0
        this.setColor(this.data.backgroundColor,this.data.autoColor,this.data.color)
        this.setSize(this.data.percent,this.data.width,this.data.height,this.data.showStripe)
        this.setTextPosition(this.data.textPosition)
        this.readyFlag.value = true

      }, 20);

    },

  },
  /**
   * 组件的初始数据
   */
  data: {
    stripe:30
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clamp (v, lower, upper) {
      'worklet'
      if (v < lower) return lower
      if (v > upper) return upper
      return v
    },
    setSize(percent,width,height,showStripe){
        this.acpre = this.clamp(percent,0,100)/100
        const pro = width * this.acpre
        this.bgWidth.value = width
        this.lineHeight.value = height
        this.textScale.value = this.clamp(height/16,0,3)
        this.proWidth.value = timing(pro,{duration:durationTime})
        // 计算斑纹
        if(showStripe){
          this.stripeHeight.value = height + 20
          this.setData({stripe:Math.round(pro/30) + 1})
        }
    },
    
    setColor(backgroundColor,autoColor,color){
      this.proColor.value = getCssColor(color)
      if(autoColor){
          this.bgColor.value = getCssColor(this.data.color) + "33"
      }else{
        this.bgColor.value = getCssColor(backgroundColor) 
      }
    },
    setTextPosition(textPosition){
      if(textPosition == 'start'){
          this.textLeft.value = 10
      }else if(textPosition == 'afterPer'){
        this.createSelectorQuery().select('.text').boundingClientRect((res)=>{
            'worklet'
            this.textLeft.value = this.data.width * this.acpre - res.width 
        }).exec()
      }else if(textPosition == 'end'){
        this.createSelectorQuery().select('.text').boundingClientRect((res)=>{
            'worklet'
            this.textLeft.value = this.data.width - res.width 
        }).exec()
      }else{
        this.textLeft.value = -100
      }
    }
  }
})