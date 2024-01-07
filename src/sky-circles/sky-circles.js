// components/sky-halfCircle/sky-halfCircle.js
import getCssColor from '../utils/colors';
const {shared,timing} = wx.worklet
let app = getApp()
const dpr = wx.getSystemInfoSync().pixelRatio 
let screenWidth = 0
if(app.globalData.sky_system.screenWidth ){
  screenWidth = app.globalData.sky_system.screenWidth
}else{
  const systemInfo = wx.getSystemInfoSync()
  app.globalData.sky_system = systemInfo
  screenWidth = app.globalData.sky_system.screenWidth 
}
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 图表唯一id，同一页面引用该组件，不能使用相同canvasId
    canvasId:{
      type:String,
      optionalTypes:[Number],
      value:""
    },
    // 图标大小，默认宽高为屏幕宽度一半
    size:{
      type:Number,
      value:1
    },
    // 圆环数据列表，最大数量最好不要超过3个
    circles:{
      type:Array,
      value:[]
    },
    // 线条粗细 可选值：default/blod/mini      
    width:{
      type:String,
      value:'default'
    },
  //  动画效果
    animation:{
      type:Boolean,
      value:true
    },
    // 点击反馈
    touchBack:{
      type:Boolean,
      value:false
    },
    // 进度开始位置(单位PI，范围0-2)，例如12点方向是0*PI,6点钟方向是1*PI
    startPI:{
      type:Number,
      value:0
    }
  },
  observers:{
    'size':function(size){
      this.whSize.value = this.clamp(size ,0 ,2)
    },
    'startPI':function(startPI){
      this.pi.value = this.clamp(startPI ,0 ,2)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  lifetimes:{
    created(){
      // 页面首次加载
      this.readyFlag = shared(false)
      // 页面hide之后show
      this.reDraw = shared(false)

      this.chartWidth = shared(screenWidth)
      this.chartHeight = shared(screenWidth)
   
      this.whSize = shared(1)
      this.pi = shared(0)
    },
    attached(){
      this.applyAnimatedStyle('.circleView', () => {
        'worklet'
        return { width: `${this.chartWidth.value * this.whSize.value / 2}px`,height: `${this.chartHeight.value * this.whSize.value / 2}px`}

      })
      this.whSize.value = this.clamp(this.data.size ,0 ,2)
      
      wx.nextTick(()=>{
        this.drawCanvas(this.data.animation,this.data.circles)
        this.readyFlag.value = true
        this.scaleFlag = 0
      },20)

    },


  },
  pageLifetimes:{
    show:function(){
      if(this.reDraw.value ){
        this.drawCanvas(false,this.data.circles)
      }
      this.reDraw.value = false

    },
    hide: function() {
      // 页面被隐藏
      this.reDraw.value = true
    },
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
    drawCanvas(animation,circles){
      this.createSelectorQuery().select('#cs' + this.data.canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {

          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          this.canvas = canvas
          this.ctx = ctx

          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr 
          
          this.circleX = canvas.width/2 
          this.circleY = canvas.width /2  
          // 图表偏移
          this.circleOff = canvas.width*0.05
          // 圆环粗细
          // this.circleW = this.circleX / (this.data.width == 'blod' ? 6 : this.data.width == 'mini' ? 10 : 8)
          const avatarW = (this.circleX / circles.length) * 0.7
          this.circleW = this.clamp(avatarW ,0 ,this.circleX/2) * (this.data.width == 'blod' ? 1 : this.data.width == 'mini' ? .6 : .8)

          this.touchParam = {
            circleX:this.circleY , 
            circleY :this.circleY, 
            circleW : this.circleW,
            circleOff:this.circleOff
          }
          // 绘制圆环
          this.drawRing(canvas,ctx,this.circleX, this.circleY, this.circleOff, this.circleW,circles);
          this.scaleC = animation ? 0 : 1
          const renderLoop = () => {
            this.drawPer(canvas,ctx,this.circleX, this.circleY, this.circleOff, this.circleW,circles)
            if(this.scaleC < 1){
              canvas.requestAnimationFrame(renderLoop)
            }
          }
          this.requestID = canvas.requestAnimationFrame(renderLoop)
        })
    },

          // 绘制半圆环
    drawRing(canvas,ctx,circleX, circleY, circleOff, circleW,circles) {

      for(var c  = 0 ; c <circles.length;c++){
        ctx.fillStyle = getCssColor(circles[c].color) + '33';
        ctx.beginPath();
        ctx.arc(circleX , circleY, circleX -circleOff - c*circleW*1.3 , 0, 2*Math.PI);
        ctx.arc(circleX, circleY, circleX -circleOff - circleW - c*circleW*1.3, 0, 2*Math.PI, true); 
        ctx.closePath();
        ctx.fill();
      }

    },

    drawPer(canvas,ctx,circleX, circleY, circleOff, circleW,circles){
      ctx.save();
      // 清除需要清除的部分
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.drawRing(canvas,ctx,circleX, circleY, circleOff, circleW,circles)
      ctx.restore();
      this.scaleC += 0.03
      for(var c =0; c<circles.length;c++){
        const startPoint = this.computerPoint(this.pi.value + 0.5,circleX,circleY,circleX -circleOff - c*circleW*1.3,circleX -circleOff -circleW- c*circleW*1.3)
        const startPI = 1.5 + this.pi.value
        const endPar = circles[c].percent*2 * this.scaleC
        ctx.fillStyle = getCssColor(circles[c].color) ;
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, circleW/2, 0, 2*Math.PI);

        ctx.arc(circleX , circleY, circleX -circleOff - c*circleW*1.3, Math.PI * startPI, Math.PI * (startPI+endPar));
        
        const endPoint = this.computerPoint(this.pi.value + 0.5 + endPar,circleX,circleY,circleX -circleOff - c*circleW*1.3,circleX -circleOff -circleW- c*circleW*1.3)
        ctx.arc(endPoint.x, endPoint.y, circleW/2, 0,2*Math.PI);
        ctx.arc(circleX, circleY, circleX -circleOff - circleW - c*circleW*1.3, Math.PI *(startPI+endPar),startPI*Math.PI, true); 
        ctx.closePath();
        ctx.fill()
      }

    },

    touchCanvas(e){
      this.createSelectorQuery().select('.circleView').boundingClientRect((res)=>{
        'worklet'
        const touchX = (e.touches[0].pageX  - res.left) * dpr
        const touchY = (e.touches[0].pageY - res.top)* dpr
        const pageX = e.touches[0].pageX
        const pageY = e.touches[0].pageY 
        var touchIndex = -1;
        for(var c = 0 ; c <this.data.circles.length;c++){
          const startPI = 1.5 + this.pi.value
          const endPar = this.data.circles[c].percent*2 
          const onSchedule= this.isPointInArc(touchX,touchY,this.touchParam.circleX, this.touchParam.circleY, this.touchParam.circleX -this.touchParam.circleOff - this.touchParam.circleW- c*this.touchParam.circleW*1.3, this.touchParam.circleX -this.touchParam.circleOff - c*this.touchParam.circleW*1.3, Math.PI*startPI, Math.PI * (startPI+endPar))
          if(onSchedule){
            touchIndex = c
          }
        }

        
        var result = {
          touchX,
          touchY,
          pageX,
          pageY,
          touchIndex
        }

        this.triggerEvent('touchCanvas', result, {})
      }).exec()
    },

     // 计算圆环起点与终点的左边
     computerPoint(endPre,centerX,centerY,outerRadius,innerRadius){
        // 参数 t
        var t = endPre * Math.PI;
        var x1 = centerX - outerRadius * Math.cos(t);
        var y1 = centerY - outerRadius * Math.sin(t); 
              

        var x2 = centerX - innerRadius * Math.cos(t);
        var y2 = centerY - innerRadius * Math.sin(t); 
        return {
          x:(x2 +x1) /2,
          y:(y2 + y1) /2
        }
    },
    
    
    isPointInArc(x, y, centerX, centerY, innerRadius, outerRadius, startAngle, endAngle) {
 
      startAngle = startAngle >= 2*Math.PI ? startAngle -2*Math.PI : startAngle
      endAngle = endAngle >= 2*Math.PI ? endAngle -2*Math.PI : endAngle
      
      // 计算点相对于圆心的角度
      var angle = Math.atan2(y - centerY, x - centerX);
      angle = angle < 0 ? angle + 2 * Math.PI : angle; // 将角度调整到 [0, 2π) 范围

      let leftFlage = false
      if(endAngle < startAngle){
        const startAngleTemp =  startAngle -  2*Math.PI
        if( angle >= startAngleTemp && angle <= endAngle){
          leftFlage = true
        }

        const endAngleTemp =  endAngle +  2*Math.PI
        if( angle >= startAngle && angle <= endAngleTemp){
          leftFlage = true
        }
      }else{
        leftFlage = angle >= startAngle && angle <= endAngle
      }

      // 计算点到圆心的距离
      var distanceToCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      // 判断距离是否在两个半径之间，角度是否在指定的范围内
      return (
        distanceToCenter >= innerRadius &&
        distanceToCenter <= outerRadius &&
        leftFlage
      );
    }


  }
})