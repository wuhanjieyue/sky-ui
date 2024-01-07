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
    canvasId:{
      type:String,
      optionalTypes:[Number],
      value:""
    },
    size:{
      type:Number,
      value:1
    },
    percent:{
      type:Number,
      value:0
    },
    backgroundColor:{
      type:String,
      value:'var(--bg-l3)'
    },
    color:{
      type:String,
      value:'var(--text-l1)'
    },
    // 线条粗细
    width:{
      type:String,
      value:'default'
    },
    animation:{
      type:Boolean,
      value:true
    },
    touchBack:{
      type:Boolean,
      value:false
    },
    // 仪表盘初始弧度
    panalRadius:{
      type:Number,
      value:0.5
    }
  },
  observers:{
    'size,percent,backgroundColor,color,width,canvasId':function(size,percent,backgroundColor,color,width,canvasId){
      if(this.readyFlag.value){
        this.whSize.value = this.clamp(size ,0 ,2)

        const _percent = this.clamp(percent ,0 ,1)
        const _type = percent - this.oldPer
        const _oldPer = this.oldPer
        this.oldPer = _percent
        this.bgColor.value = getCssColor(backgroundColor)
        this.cirColor.value = getCssColor(color)
        this.drawCanvas(this.data.animation,_percent,_oldPer,_type)
      }
      if(canvasId.length > 13){
        console.warn("canvasId过长")
      }
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
      this.chartOpacity = shared(0)

      this.bgColor = shared('#dcdcdc')
      this.cirColor = shared('#c4c4c5')
      
    },
    attached(){
      this.applyAnimatedStyle('.halfCircleView', () => {
        'worklet'
        return { width: `${this.chartWidth.value * this.whSize.value/2}px`,height: `${this.chartHeight.value * this.whSize.value /2}px`,opacity:`${this.chartOpacity.value }`}

      })
      this.oldPer = this.data.percent
      this.chartOpacity.value = timing(1,{duration:200})
      this.bgColor.value = getCssColor(this.data.backgroundColor)
      this.cirColor.value = getCssColor(this.data.color)
      this.whSize.value = this.clamp(this.data.size ,0 ,2)
      
      wx.nextTick(()=>{
        this.drawCanvas(this.data.animation,this.data.percent,0,this.data.percent)
        this.readyFlag.value = true
        this.scaleFlag = 0
      },20)

    },


  },
  pageLifetimes:{
    show:function(){
      if(this.reDraw.value ){
        this.drawCanvas(false,this.data.percent,0,this.data.percent - 0)
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
    drawCanvas(animation,percent,oldPer,type){
      this.createSelectorQuery().select('#hc' + this.data.canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {

          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          this.canvas = canvas
          this.ctx = ctx

          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr 
          
          const circleX = canvas.width/2 
          const circleY = canvas.width /2  

          // 图表偏移
          const circleOff = canvas.width*0.05
          // 圆环粗细
          const circleW = circleX / (this.data.width == 'blod' ? 4 : this.data.width == 'mini' ? '8' : 6)
          // 仪表盘初始化弧度
          this.panalPer = this.clamp(this.data.panalRadius ,0 ,1) * 0.495  
          this.endPre = animation ? oldPer  : percent

          this.touchParam = {
            centerX : circleX, 
            centerY : circleY, 
            innerRadius : circleX - circleW - circleOff, 
            outerRadius : circleX- circleOff, 
            circleW,
            circleOff,
            startAngle : Math.PI * (1- this.panalPer),
            endAngle : (1+percent)* Math.PI
          }

          
          this.startPoint = this.computerPoint(-this.panalPer,circleX,circleY,circleX- circleOff,circleX - circleW - circleOff)
          this.endPoint = this.computerPoint(1+this.panalPer,circleX,circleY,circleX- circleOff,circleX - circleW - circleOff)
          
          // 点击缩放的初始状态
          this.outScale = circleX- circleOff
          this.inScale = circleX - circleW - circleOff
          this.maxScale = this.touchParam.outerRadius + (this.touchParam.outerRadius - this.touchParam.innerRadius)/10

          // 绘制半圆环
          this.drawHalfRing(ctx,circleX, circleY, circleX - circleW - circleOff, circleX- circleOff ,circleW,circleOff);
          const renderLoop = () => {
            this.drawHalfPer(canvas,ctx,circleX, circleY, circleX - circleW- circleOff, circleX- circleOff ,circleW,percent,type,circleOff)
            if(type > 0){
              if(this.endPre < percent){
                canvas.requestAnimationFrame(renderLoop)
              }
            }else{
              if(this.endPre > percent){
                canvas.requestAnimationFrame(renderLoop)
              }
            }
          }
          this.requestID = canvas.requestAnimationFrame(renderLoop)
   
        })
    },

          // 绘制半圆环
    drawHalfRing(context,centerX, centerY, innerRadius, outerRadius,circleW,circleOff) {

      context.fillStyle = this.bgColor.value;
      context.beginPath();
      // context.moveTo(circleW+circleOff,centerY)
      context.arc(this.startPoint.x, this.startPoint.y, circleW/2, 0, 2*Math.PI);
      // context.lineTo(circleOff, centerY)

      context.arc(centerX , centerY, outerRadius, Math.PI * (1-this.panalPer), this.panalPer*Math.PI);

      context.arc(this.endPoint.x, this.endPoint.y, circleW/2, 0,2*Math.PI);

      context.arc(centerX, centerY, innerRadius, Math.PI * this.panalPer, (1-this.panalPer)*Math.PI, true); 

      context.closePath();
      context.fill();
    },

    drawHalfPer(canvas,context,centerX, centerY, innerRadius, outerRadius,circleW,percent,type,circleOff) {
      context.save();
      // 清除需要清除的部分
      context.clearRect(0, 0, canvas.width, canvas.height)
      this.drawHalfRing(context,centerX, centerY, innerRadius, outerRadius,circleW,circleOff)
      context.restore();
      if(type > 0){
        this.endPre += 0.02 ;
      }else if(type < 0){

        this.endPre -= 0.02 ;
      }
      if(this.endPre == 0 ){
        return
      }
      const pi = 1 + this.endPre
      context.fillStyle = this.cirColor.value;
      context.beginPath();
      context.arc(this.startPoint.x, this.startPoint.y, circleW/2, 0, 2*Math.PI);


        context.arc(centerX , centerY, outerRadius, Math.PI * (1-this.panalPer), pi*Math.PI);

      
        var perPoint =   this.computerPoint(this.endPre,centerX,centerY,centerX- circleOff,centerX - circleW - circleOff)

        context.arc(perPoint.x, perPoint.y, circleW/2, 0,2*Math.PI);

        context.arc(centerX, centerY, innerRadius, Math.PI * pi, (1-this.panalPer)*Math.PI, true); 

        context.closePath();
        // context.lineWidth = 10
        // context.strokeStyle = this.cirColor.value
        // context.stroke()
        context.fill()
        
        if(type > 0 && this.endPre >= percent){
            canvas.cancelAnimationFrame(this.requestID)
        }else if(type < 0 && this.endPre <= percent){
            canvas.cancelAnimationFrame(this.requestID)
        }
    },

    touchCanvas(e){
      this.createSelectorQuery().select('.halfCircleView').boundingClientRect((res)=>{
        'worklet'
        const touchX = (e.touches[0].pageX  - res.left) * dpr
        const touchY = (e.touches[0].pageY - res.top)* dpr
        const pageX = e.touches[0].pageX
        const pageY = e.touches[0].pageY 
        const onSchedule= this.isPointInArc(touchX,touchY,this.touchParam.centerX, this.touchParam.centerY, this.touchParam.innerRadius, this.touchParam.outerRadius, this.touchParam.startAngle, this.touchParam.endAngle)
        // scaleFlag = 0 时表示无缩放动画，才能继续下个动画
        if(this.data.touchBack && this.scaleFlag == 0){
          if(onSchedule && this.outScale < this.maxScale){
            this.scaleFlag = onSchedule ? 1 : -1;
            this.scaleSchedule()
          }else if((! onSchedule) && this.outScale > this.touchParam.outerRadius){
            this.scaleFlag = onSchedule ? 1 : -1;
            this.scaleSchedule()
          }
        }
        var result = {
          touchX,
          touchY,
          pageX,
          pageY,
          onSchedule
        }

        this.triggerEvent('touchCanvas', result, {})
      }).exec()
    },

    scaleSchedule(){
      const scaleLoop = () => {
        this.drawScale(this.canvas,this.ctx,this.touchParam.centerX, this.touchParam.centerY, this.touchParam.innerRadius, this.touchParam.outerRadius,this.touchParam.circleW,this.data.percent,this.touchParam.circleOff)

        if(this.outScale < this.maxScale && this.outScale > this.touchParam.outerRadius){

          this.canvas.requestAnimationFrame(scaleLoop)
        }else{
          this.scaleFlag = 0
        }
      }
    
      
      this.scaleLoopID = this.canvas.requestAnimationFrame(scaleLoop)
    },
    drawScale(canvas,context,centerX, centerY, innerRadius, outerRadius,circleW,percent,circleOff){
      context.save();
      // 清除需要清除的部分
      context.clearRect(0, 0, canvas.width, canvas.height)
      this.drawHalfRing(context,this.touchParam.centerX, this.touchParam.centerY, this.touchParam.innerRadius, this.touchParam.outerRadius,this.touchParam.circleW,this.touchParam.circleOff)
      context.restore();

      if(this.scaleFlag > 0 ){
        this.outScale += 3 ;
        this.inScale -= 3;
      }else if(this.scaleFlag < 0){
        this.outScale -= 3 ;
        this.inScale += 3;

      }

      const pi = 1 + this.endPre
      context.fillStyle = this.cirColor.value;




      context.beginPath();
      context.arc(this.startPoint.x, this.startPoint.y, (this.outScale - this.inScale)/2, 0, 2*Math.PI);
      context.arc(centerX , centerY, this.outScale, Math.PI * (1-this.panalPer), pi*Math.PI);
      
        var perPoint =   this.computerPoint(this.endPre,centerX,centerY,centerX- circleOff,centerX - circleW - circleOff)

        context.arc(perPoint.x, perPoint.y, (this.outScale - this.inScale)/2, 0,2*Math.PI);

        context.arc(centerX, centerY, this.inScale, Math.PI * pi, (1-this.panalPer)*Math.PI, true); 
        context.closePath();
        context.fill()
        
    
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
      // 计算点相对于圆心的角度
      var angle = Math.atan2(y - centerY, x - centerX);
      angle = angle < 0 ? angle + 2 * Math.PI : angle; // 将角度调整到 [0, 2π) 范围
    
      // 计算点到圆心的距离
      var distanceToCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
      // 判断距离是否在两个半径之间，角度是否在指定的范围内
      return (
        distanceToCenter >= innerRadius &&
        distanceToCenter <= outerRadius &&
        angle >= startAngle &&
        angle <= endAngle
      );
    }


  }
})