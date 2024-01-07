// components/sky-halfCircle/sky-halfCircle.js
import getCssColor from '../utils/colors';
import SkyUtils from '../utils/skyUtils'
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
    // 图表唯一id
    canvasId:{
      type:String,
      optionalTypes:[Number],
      value:"123"
    },
    // 图表宽度
    chartWidth:{
      type:Number,
      optionalTypes:[String],
      value:screenWidth
    },
    // 图标高度
    chartHeight:{
      type:Number,
      optionalTypes:[String],
      value:screenWidth/2
    },
    // 图标数据
    lineList:{
      type:Array,
      value:[]
    },
    // 图表是否显示展开动画
    animation:{
      type:Boolean,
      value:true
    },
    // 是否显示图表坐标轴
    showAxis:{
      type:Boolean,
      value:false
    },
    // 图表类型 line 直连线 /smooth 平滑过渡
    type:{
      type:String,
      value:"smooth"
    },
    // 点击交互
    touchBack:{
      type:Boolean,
      value:false
    },
  },
  observers:{
    'chartWidth,chartHeight':function(chartWidth,chartHeight){
      this.chartWidth.value = chartWidth
      this.chartHeight.value = chartHeight
    },
    'lineList':function(lineList){
      if(this.readyFlag.value){
        this.drawCanvas(lineList,this.data.animation)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    tipData:{}
  },
  lifetimes:{
    created(){

      // 页面首次加载
      this.readyFlag = shared(false)
      // 页面hide之后show
      this.reDraw = shared(false)
      this.chartWidth = shared(screenWidth)
      this.chartHeight = shared(screenWidth/2)
      this.tipLeft = shared(0)
      this.tipShow = shared(0)
      
    },
    attached(){

      this.applyAnimatedStyle('.halfCircleView', () => {
        'worklet'
        return {width:`${this.chartWidth.value}px`,height:`${this.chartHeight.value}px` }
      })
      
      this.applyAnimatedStyle('.tipview', () => {
        'worklet'
        return {left:`${this.tipLeft.value}px`,opacity:`${this.tipShow.value}`,transform: `scale(${this.tipShow.value})` }
      })
    },
    ready(){
      this.drawCanvas(this.data.lineList,this.data.animation)
      this.readyFlag.value = true
    }

  },
  pageLifetimes:{
    show:function(){
      if(this.reDraw.value ){
        this.drawCanvas(this.data.lineList,false)
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
 
    drawCanvas(listTemp,animation){
      let list = []
      wx.SkyUtils = SkyUtils
      if(wx.SkyUtils){
         list = wx.SkyUtils.deepClone(listTemp)
      }else{
        list = wx.SkyUtils.deepClone(listTemp)
      }
      this.createSelectorQuery().select('#hc' + this.data.canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
          let canvas = res[0].node
          let ctx = canvas.getContext('2d')
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr 
         
          this.canvas = canvas
          this.ctx = ctx
          // 获取最长的数组，计算出平均的x值
          let maxLength = 0;
          let maxY = 0;
          for (var i =0;i<list.length;i++) {
            const temp = list[i].pointList
              if (temp.length > maxLength) {
                  maxLength = temp.length;
              }
              for(var j=0;j < temp.length;j++){
                if(temp[j].y > maxY){
                  maxY = temp[j].y
                }

              }
          }
          this.maxY = maxY;

          // 左侧边距
          this.paddingLeft = 9*dpr
          this.paddingBottom = -6*dpr
          ctx.translate(this.paddingLeft*dpr, this.paddingBottom*dpr);
          this.averageX = (canvas.width - this.paddingLeft*dpr) / (maxLength - 1);
          this.averageY = maxY / canvas.height * 1.2
          this.scaleY = animation ? 1 : 0
          
          for(var l in list){
            let item = list[l]
            const pointsTemp = item.pointList
            // item['scaleY'] = animation ? 1 : 0;
            for(var k=0;k < pointsTemp.length ; k++){
              pointsTemp[k].y = (canvas.height - pointsTemp[k].y / this.averageY )
            }
            item['pointList'] = pointsTemp
          }
          
          this.list = list;
          let renderLoop = () => {
            this.drawSmoothLine(ctx,canvas,list)
            if(this.scaleY > 0){
              this.scaleY <= 1 ? 0 : this.scaleY
              canvas.requestAnimationFrame(renderLoop)
            }
          }
          canvas.requestAnimationFrame(renderLoop)


        })
  },

  drawSmoothLine(ctx,canvas,list){
    ctx.save()
    ctx.clearRect(-this.paddingLeft*dpr, 2*this.paddingBottom*dpr, canvas.width + 2*this.paddingLeft*dpr, canvas.height - 4*this.paddingBottom*dpr)
      this.scaleY -= 0.05
      this.drawFun(ctx,canvas,list,false)

      ctx.restore();
  },
    drawFun(ctx,canvas,list,touch){
      for(var l in list){
        var data = this.list[l]
        const points = data.pointList 
        if(points.length < 3){
          return;
        }
        const f = 0.6;
        const t = 0.6;
        const  gradient = (a,b)=>{
          return (b.y-a.y)/(b.canvasX - a.canvasX)
        }
        ctx.beginPath()

        ctx.moveTo(0,points[0].y + (canvas.height -points[0].y)* this.scaleY)


        let g = 0;
        let dx1 =0 ;
        let dy1 = 0;
        let dx2 = 0;
        let dy2 = 0 ;
        let prePoint = points[0];
        prePoint['canvasX'] = 0
        let nextPoint = null;
        for(let i =1 ; i < points.length ; i++){

          let curPoint = points[i]
          curPoint['canvasX'] = i * this.averageX
          nextPoint = points[i+1]
          if(nextPoint){
            nextPoint['canvasX'] = (i+1) * this.averageX
            g = gradient(prePoint,nextPoint)
            dx2 = (nextPoint.canvasX - curPoint.canvasX) * (-f)
            dy2 = dx2 * g * t 
            if(nextPoint.y == curPoint.y){
              dy2 = 0
            }else if(prePoint.y == curPoint.y){
              dy2 = 0
            }
          }else {
            dx2 = 0;
            dy2 = 0;
          }     
        const itemY = curPoint.y + (canvas.height- curPoint.y) * this.scaleY 
          if(this.data.type == 'line'){
            ctx.lineTo(curPoint.canvasX,itemY)
          }else{
            ctx.bezierCurveTo(prePoint.canvasX - dx1,(prePoint.y - dy1) + (canvas.height - prePoint.y + dy1)* this.scaleY ,curPoint.canvasX + dx2 ,(curPoint.y + dy2) + (canvas.height -curPoint.y - dy2)* this.scaleY ,curPoint.canvasX,itemY)   ;
          }
        
          dx1 = dx2;
          dy1 = dy2;
          prePoint = curPoint
        }
        ctx.lineWidth = (data.lineWidth ? data.lineWidth : 3) * dpr;
        ctx.strokeStyle = getCssColor(data.lineColor);
        ctx.stroke()
        ctx.lineTo(points[points.length -1 ].canvasX, canvas.height+3*dpr);
        ctx.lineTo(points[0].canvasX, canvas.height+3*dpr);
        ctx.closePath();
        ctx.restore()

        if(data.fill){
          this.fillWithGradient(ctx,canvas,data)
        }
        if(touch){
          this.drawTouchPoint(ctx,canvas,data)

        }else{
          this.drawPoint(ctx,canvas,data)
        }

        
        if(this.data.showAxis && l == list.length - 1){
          let lines = [{
            y:canvas.height/12 * 2 , 
            x:this.maxY 
          },{
            y:canvas.height/12 * 7,
            x:this.maxY /2
          },{
            y:canvas.height + 3*dpr,
            x:0
          }]
          this.drawLineDash(ctx,canvas,lines)
        }
        if(this.data.showAxis){
          this.drawXLine(ctx,canvas,data)
        }
      }
      
    },
    drawLineDash(ctx,canvas,lines){
        const color = getCssColor('var(--bg-l3)');
        ctx.save()
        // 开始路径并绘制虚线
        ctx.strokeStyle = color;

        for(var i in lines){
          if(lines[i].y >= canvas.height){
            ctx.setLineDash([]);
            // 设置线条颜色和宽度
            ctx.lineWidth = 4;
          }else{
            ctx.setLineDash([15, 15]);
          // 设置线条颜色和宽度
          ctx.lineWidth = 2;
          }
          ctx.beginPath();
          ctx.moveTo(0, lines[i].y);
          ctx.lineTo(canvas.width, lines[i].y);

          // 设置字体样式
          ctx.font = 10*dpr +'px Arial';
          // 设置文本颜色
          ctx.fillStyle = color;
          // 使用 fillText 绘制文本
          ctx.fillText(lines[i].x, (-this.paddingLeft/2)*dpr, lines[i].y );
          ctx.stroke();
        }
        ctx.closePath();
        ctx.restore()
    },
    
    drawXLine(ctx,canvas,data){
      const color = getCssColor('var(--bg-l3)');

      const pointList = data.pointList
      ctx.font = 10*dpr +'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      // ctx.clearRect(-this.paddingLeft, canvas.height, canvas.width , canvas.height+this.paddingBottom)

      for(var i in pointList){
          if(pointList[i].showX){
            // 绘制坐标轴线
            ctx.beginPath();
            ctx.moveTo( i*this.averageX, canvas.height );
            ctx.lineTo(i*this.averageX, canvas.height + 5*dpr);
            ctx.stroke();
            ctx.fillText(pointList[i].x, i*this.averageX, canvas.height + 13*dpr);
          }
      }


        
    },
    // 添加渐变色填充
     fillWithGradient(context,canvas,data) {
      const points = data.pointList 

      var gradient = context.createLinearGradient(0,0, 0,canvas.height );
      gradient.addColorStop(0, getCssColor(data.lineColor) + 'BF'); // 起始颜色
      gradient.addColorStop(1, getCssColor(data.lineColor) + '1A'); // 结束颜色

      context.fillStyle = gradient;
      context.fill();
      
    },

    drawPoint(context,canvas,data){
      
      const lineWidth = data.lineWidth ? data.lineWidth : 3
      const points = data.pointList 

      for(var i = 0 ;i < points.length ;i++){
        if(points[i].showPoint){
          this.drawEmpotPoint(context,canvas,lineWidth,points[i],i,data.lineColor)

        }
      }

    },

    drawTouchPoint(context,canvas,data){
      const color = getCssColor(data.lineColor)
      const lineWidth = data.lineWidth ? data.lineWidth : 3
      const points = data.pointList 

      for(var i = 0 ;i < points.length ;i++){
          if(this.index == i){
            context.beginPath()
            context.arc(i*this.averageX , points[i].y + (canvas.height-  points[i].y) * this.scaleY , lineWidth * dpr, 0, 2 * Math.PI)
            context.lineWidth = 2 * lineWidth * dpr
            context.strokeStyle =  color
            context.stroke()
            context.fillStyle = color
            context.fill()
            context.closePath()
          }else if(points[i].showPoint){
            this.drawEmpotPoint(context,canvas,lineWidth,points[i],i,data.lineColor)
          }
          
      }
    },
    drawEmpotPoint(context,canvas,lineWidth,point,i,lineColor){
      context.beginPath()
      context.arc(i*this.averageX , point.y + (canvas.height-  point.y) * this.scaleY , lineWidth/2 * dpr, 0, 2 * Math.PI)
      context.lineWidth = 2 * lineWidth * dpr
      context.strokeStyle =  getCssColor(lineColor)
      context.stroke()
      context.fillStyle = getCssColor('var(--bg-l0)')
      context.fill()
      context.closePath()
    },
    moveCanvas(e){
      this.createSelectorQuery().select('.halfCircleView').boundingClientRect((res)=>{
        'worklet'
        const touchX = (e.touches[0].pageX  - res.left) * dpr
        const touchY = (e.touches[0].pageY - res.top)* dpr
        const pageX = e.touches[0].pageX
        const pageY = e.touches[0].pageY 
        const indexTemp = Math.round((touchX - this.paddingLeft*dpr) / this.averageX )
        this.index= indexTemp <= 0 ? 0 : indexTemp
        if(this.data.touchBack){
          this.showLine2point(this.ctx,this.canvas,this.index,touchX/dpr)
        }
        var result = {
          touchX,
          touchY,
          pageX,
          pageY
        }
        this.triggerEvent('touchCanvas', result, {})
      }).exec()
    },
    touchCanvas(e){
      clearTimeout(this.timeOut)
      this.createSelectorQuery().select('.halfCircleView').boundingClientRect((res)=>{
        'worklet'
        const touchX = (e.touches[0].pageX  - res.left) * dpr
        const touchY = (e.touches[0].pageY - res.top)* dpr
        const pageX = e.touches[0].pageX
        const pageY = e.touches[0].pageY 
        const indexTemp = Math.round((touchX - this.paddingLeft*dpr) / this.averageX )
        if(this.data.touchBack){

          if(this.tipShow.value == 0){
            this.index= indexTemp <= 0 ? 0 : indexTemp
            this.showLine2point(this.ctx,this.canvas,this.index,touchX/dpr)
           }else{
              this.drawBg()
           }
        }
       
        var result = {
          touchX,
          touchY,
          pageX,
          pageY
        }
        this.triggerEvent('touchCanvas', result, {})
      }).exec()
    },

    showLine2point(ctx,canvas,index,touchx){
      ctx.save()
      ctx.clearRect(-this.paddingLeft*dpr, 2*this.paddingBottom*dpr, canvas.width + 2*this.paddingLeft*dpr, canvas.height - 4*this.paddingBottom*dpr)
      this.drawFun(ctx,canvas,this.list,true)
      ctx.restore();

      
      const color = getCssColor('var(--bg-l3)');
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo( index*this.averageX, canvas.height * 1/6);
      ctx.lineTo( index*this.averageX, canvas.height + 3*dpr);
      ctx.stroke();
      ctx.closePath()
      let ylist = []
      for(var y in this.data.lineList){
        if( this.data.lineList[y].pointList.length >= index){
          const point = this.data.lineList[y].pointList[index]
          if(point){
            const yitem = {
              color : this.data.lineList[y].lineColor,
              yname:this.data.lineList[y].name,
              yvalue:point.y
            }
            ylist.push(yitem)
          }

        }
       
      }
      if(touchx >= screenWidth/2){
        this.tipLeft.value = touchx - screenWidth/2
      }else{
        this.tipLeft.value = touchx
      }
      this.tipShow.value = 0.9
      this.setData({tipData:{
        x:this.data.lineList[0].pointList[index].x,
        ylist:ylist
      }})
    },
    closeTip(){
        this.timeOut = setTimeout(() => {
          this.drawBg()
        }, 3000);
    },
    drawBg(){
      this.ctx.save()
      this.ctx.clearRect(-this.paddingLeft*dpr, 2*this.paddingBottom*dpr, this.canvas.width + 2*this.paddingLeft*dpr, this.canvas.height - 4*this.paddingBottom*dpr)
      this.drawFun(this.ctx,this.canvas,this.list,false)
      this.ctx.restore();
      this.tipShow.value = 0
    }
// 下载图表图片
    // drawOffFun(data,touch){
    //   const canvas = wx.createOffscreenCanvas({type:'2d',width:this.chartWidth.value,height:this.chartHeight.value}) 
    //   const ctx = canvas.getContext("2d")
    //   canvas.width = this.chartWidth.value * dpr
    //   canvas.height = this.chartHeight.value * dpr 
    //   ctx.translate(this.paddingLeft*dpr, this.paddingBottom*dpr);
    //   const points = data.pointList 
    //     if(points.length < 3){
    //       return;
    //   }
    //   const f = 0.6;
    //   const t = 0.6;
    //   const  gradient = (a,b)=>{
    //     return (b.y-a.y)/(b.canvasX - a.canvasX)
    //   }
    //   ctx.beginPath()

    //   ctx.moveTo(0,points[0].y + (canvas.height -points[0].y)* this.scaleY)

    //   let g = 0;
    //   let dx1 =0 ;
    //   let dy1 = 0;
    //   let dx2 = 0;
    //   let dy2 = 0 ;
    //   let prePoint = points[0];
    //   prePoint['canvasX'] = 0
    //   let nextPoint = null;
    //   for(let i =1 ; i < points.length ; i++){

    //     let curPoint = points[i]
    //     curPoint['canvasX'] = i * this.averageX
    //     nextPoint = points[i+1]
    //     if(nextPoint){
    //       nextPoint['canvasX'] = (i+1) * this.averageX
    //       g = gradient(prePoint,nextPoint)
    //       dx2 = (nextPoint.canvasX - curPoint.canvasX) * (-f)
    //       dy2 = dx2 * g * t 
    //       if(nextPoint.y == curPoint.y){
    //         dy2 = 0
    //       }else if(prePoint.y == curPoint.y){
    //         dy2 = 0
    //       }
    //     }else {
    //       dx2 = 0;
    //       dy2 = 0;
    //     }     
    //    const itemY = curPoint.y + (canvas.height- curPoint.y) * this.scaleY 
    //     if(this.data.type == 'line'){
    //       ctx.lineTo(curPoint.canvasX,itemY)
    //     }else{
    //       ctx.bezierCurveTo(prePoint.canvasX - dx1,(prePoint.y - dy1) + (canvas.height - prePoint.y + dy1)* this.scaleY ,curPoint.canvasX + dx2 ,(curPoint.y + dy2) + (canvas.height -curPoint.y - dy2)* this.scaleY ,curPoint.canvasX,itemY)   ;
    //     }
       
    //     dx1 = dx2;
    //     dy1 = dy2;
    //     prePoint = curPoint
    //   }
    //   ctx.lineWidth = (data.lineWidth ? data.lineWidth : 3) * dpr;
    //   ctx.strokeStyle = getCssColor(data.lineColor);
    //   ctx.stroke()
    //   ctx.lineTo(points[points.length -1 ].canvasX, canvas.height);
    //   ctx.lineTo(points[0].canvasX, canvas.height);
    //   ctx.closePath();
    //   ctx.restore()

    //   if(data.fill){
    //     this.fillWithGradient(ctx,canvas,data)
    //   }
    //   if(touch){
    //     this.drawTouchPoint(ctx,canvas,data)

    //   }else{
    //     this.drawPoint(ctx,canvas,data)
    //   }

    //   let lines = [{
    //     y:canvas.height/12 * 2 , 
    //     x:this.maxY 
    //   },{
    //     y:canvas.height/12 * 7,
    //     x:this.maxY /2
    //   },{
    //     y:canvas.height,
    //     x:0
    //   }]
    //   this.drawLineDash(ctx,canvas,lines)
    //   this.drawXLine(ctx,canvas,data)
      
    //   console.log(canvas.toDataURL({'image/png',1}))
    // },
  }
})