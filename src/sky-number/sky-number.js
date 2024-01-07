// components/sky-number/sky-number.js
const {shared,sequence,timing,delay,runOnUI} = wx.worklet
Component({
  lifetimes:{
    created(){
      this.viewSca = shared(1)
      this.readyFlag = shared(false)

    },
    attached(){
        this.applyAnimatedStyle('.numberview', () => {
          'worklet'
          return {transform: `scale(${this.viewSca.value})` }
      })
    },
    ready(){
      this.readyFun(this.data.duration,this.data.animation,this.data.trimZero,this.data.formatType,this.data.number)
      this.readyFlag.value = true
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 数字
    number:{
      type:Number,
      optionalTypes:[String],
      value:0
    },
    // 字体类型  默认 'din'
    fontType:{
      type:String,
      value:'din'
    },
    // 数字展示类型 可选：normal 普通使用/commas 千位分隔 / upper  转大写 / lower 转小写
    formatType:{
      type:String,
      value:'normal'
    },
    // 清除数字末尾无效的0
    trimZero:{
      type:Boolean,
      value:false
    },
    // 数字改变的时长
    duration:{
      type:Number,
      optionalTypes:[String],
      value:0
    },
    // 数字变化时显示动画效果
    animation:{
      type:Boolean,
      value:false
    }
  },
  observers:{
    'duration,animation,trimZero,formatType,number':function(duration,animation,trimZero,formatType,number){
        if(this.readyFlag.value){
          this.readyFun(duration,animation,trimZero,formatType,number)
        }
      
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _oldNumber:0,
    _beginChange:false,
    formatNumber:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    readyFun(duration,animation,trimZero,formatType,number){
      if(duration > 0 && ! this.data._beginChange){
        this.setData({_beginChange:true})
        if(animation){
          runOnUI(this.runAnimation.bind(this))(duration/2)
        }
        if(number > this.data._oldNumber){
          this.numberAdd(this.data._oldNumber,number,duration,trimZero,formatType)

        }else{
        this.numberSub(this.data._oldNumber,number,duration,trimZero,formatType)
          
        }
      }else{
        this.numberFun(trimZero,formatType,number)
      }
    },
    numberFun(trimZero,formatType,number){
      const numberTemp = number;
      if(trimZero){
        number = wx.SkyUtils.removeTrailingZeros(number)
      }
      if(formatType == "commas"){
        number = wx.SkyUtils.formatNumberWithCommas(number)
      }else if(formatType == "upper"){
        number = wx.SkyUtils.numberUpper(number)
      }
      this.setData({formatNumber:number,_oldNumber:numberTemp})
    },
    numberAdd(startValue,endValue,duration,trimZero,formatType){
      var length = 0;
      var endStr = endValue.toString()
      
      if(endStr.split(".").length  == 2){
        length = endStr.split(".")[1].length
      }
      // 更新间隔时间（毫秒）
      var interval = 50;
      // 计算每个间隔应该变化的步长
      var step = (endValue - startValue) / (duration / interval);
      step = step.toFixed(length)
      // 设置一个定时器，每隔interval毫秒更新一次数值
      var timer = setInterval(()=> {
          // 更新当前值
          startValue =  wx.SkyUtils.accAdd(startValue,step)
          if(startValue >= endValue){
            startValue = endValue
            this.setData({_beginChange:false})
            // 达到目标值时清除定时器
            clearInterval(timer);
          }
          this.numberFun(trimZero,formatType,startValue.toFixed(length))

      }, interval);
    },
    numberSub(startValue,endValue,duration,trimZero,formatType){
     
      
      var length = 0;
      var endStr = endValue.toString()
      
      if(endStr.split(".").length  == 2){
        length = endStr.split(".")[1].length
      }
      // 更新间隔时间（毫秒）
      var interval = 50;
      // 计算每个间隔应该变化的步长
      var step = (startValue - endValue) / (duration / interval);
      step = step.toFixed(length)

      // 设置一个定时器，每隔interval毫秒更新一次数值
      var timer = setInterval(()=> {
          // 更新当前值
          startValue =  wx.SkyUtils.accSub(startValue,step)
          
          if(startValue <= endValue){
            startValue = endValue
            this.setData({_beginChange:false})
            // 达到目标值时清除定时器
            clearInterval(timer);
          }
          this.numberFun(trimZero,formatType,startValue.toFixed(length))
      }, interval);
    },
    runAnimation(duration){
      'worklet'
        this.viewSca.value = sequence(timing(1.2,{duration:duration}),delay(duration/2, timing(1,{duration:duration})))
    }
  }
})