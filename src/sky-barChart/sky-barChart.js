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
    color:{
      type:String,
      value:'var(--suc-l1)'
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

      
    },
    attached(){

      this.applyAnimatedStyle('.halfCircleView', () => {
        'worklet'
        return {width:`${this.chartWidth.value}px`,height:`${this.chartHeight.value}px` }
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
          let maxLength = list.length;
          let maxY = 0;
          for (var i =0;i<list.length;i++) {
            const temp = list[i]
            if(temp.y > maxY){
              maxY = temp.y
            }
          }
          this.maxY = maxY;

          // 左侧边距
          this.paddingLeft = this.data.showAxis ? 9*dpr : 0
          this.paddingBottom = -6*dpr
          ctx.translate(this.paddingLeft*dpr, this.paddingBottom*dpr);
          this.averageX = (canvas.width - this.paddingLeft*dpr) / (maxLength );
          this.averageY = maxY / canvas.height * 1.3

          this.scaleY = animation ? 1 : 0
          for(var l in list){
            let item = list[l]
            item.y = canvas.height -  item.y / this.averageY
          }
          this.list = list;
          let renderLoop = () => {
            this.drawBarLine(ctx,canvas,list)
            if(this.scaleY > 0){
              this.scaleY <0 ? 0 : this.scaleY
              canvas.requestAnimationFrame(renderLoop)
            }else{
              this.scaleY = 0
            }
          }
          canvas.requestAnimationFrame(renderLoop)


        })
  },

  drawBarLine(ctx,canvas,list){
  
      ctx.clearRect(-this.paddingLeft*dpr, 2*this.paddingBottom*dpr, canvas.width + 2*this.paddingLeft*dpr, canvas.height - 4*this.paddingBottom*dpr)
      this.scaleY -= 0.05
      ctx.fillStyle = getCssColor(this.data.color)
      this.drawFun(ctx,canvas,list,false)
  },
    drawFun(ctx,canvas,list,touch){
        const width =  this.clamp(this.averageX*0.7,10*dpr,canvas.width/10)
        const startY = canvas.height 
        const radius = 8*dpr > this.averageX/4 ?this.averageX/4 : 8*dpr
        for(var l in list){
         
          const item = list[l]
          if(item.y == canvas.height){
            continue;
          }
          const itemy = (item.y  + item.y *this.scaleY) >= (startY - radius) ? (startY - radius)  : item.y  + item.y *this.scaleY
          const itemx = this.averageX*l + (this.averageX - width)/2

          if(touch && l == this.touchIndex){
            if(item.color){
              ctx.fillStyle = getCssColor(item.color) + "33"
            }else{
              ctx.fillStyle = getCssColor(this.data.color) + "33"
            }
            ctx.fillRect(this.averageX*l,0 , this.averageX, canvas.height)
          }

          if(item.color){
            ctx.fillStyle = getCssColor(item.color)
          }else{
            ctx.fillStyle = getCssColor(this.data.color) 
          }
          ctx.beginPath();
          ctx.moveTo(itemx, startY);
          ctx.lineTo(itemx , itemy + radius);
          ctx.arcTo(itemx , itemy , itemx + radius, itemy, radius);
          ctx.lineTo(itemx + width -radius, itemy);
          ctx.arcTo(itemx+width , itemy , itemx + width, itemy + radius, radius);
          ctx.lineTo(itemx + width , startY);
          ctx.closePath();
          ctx.fill()
        }

      if(this.data.showAxis ){
        let lines = [{
          y:canvas.height/13 * 3 , 
          x:this.maxY 
        },{
          y:canvas.height/13 * 8,
          x:this.maxY /2
        },{
          y:canvas.height ,
          x:0
        }]
        this.drawLineDash(ctx,canvas,lines)
        this.drawXLine(ctx,canvas,list)
        ctx.restore();

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
    
    drawXLine(ctx,canvas,list){
      const color = getCssColor('var(--bg-l3)');

      ctx.font = 10*dpr +'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      

      for(var i in list){
          if(list[i].showX){
            const x = 0.5+ parseInt(i)
            // 绘制坐标轴线
            ctx.beginPath();
            ctx.moveTo( x*this.averageX, canvas.height );
            ctx.lineTo(x*this.averageX, canvas.height + 5*dpr);
            ctx.stroke();
            ctx.fillText(list[i].x, x*this.averageX  , canvas.height + 13*dpr);
          }
      }
    },

    touchCanvas(e){
      this.createSelectorQuery().select('.halfCircleView').boundingClientRect((res)=>{
        'worklet'
        const touchX = (e.touches[0].pageX  - res.left) * dpr
        const touchY = (e.touches[0].pageY - res.top)* dpr
        const pageX = e.touches[0].pageX
        const pageY = e.touches[0].pageY 
        const indexTemp = (touchX - this.paddingLeft*dpr) / this.averageX
        
        if(this.data.touchBack){
            this.touchIndex = Math.floor(indexTemp )
            this.scaleY = 0
            this.ctx.clearRect(-this.paddingLeft*dpr, 2*this.paddingBottom*dpr, this.canvas.width + 2*this.paddingLeft*dpr, this.canvas.height - 4*this.paddingBottom*dpr)
            this.ctx.fillStyle = getCssColor(this.data.color)
            this.drawFun(this.ctx,this.canvas,this.list,true)
        }
       
        var result = {
          touchX,
          touchY,
          pageX,
          pageY,
          index:this.touchIndex
        }
        this.triggerEvent('touchCanvas', result, {})
      }).exec()
    },
    cancleTouch(){
      this.scaleY = 0
      this.ctx.fillStyle = getCssColor(this.data.color)
      setTimeout(() => {
        this.ctx.clearRect(-this.paddingLeft*dpr, 2*this.paddingBottom*dpr, this.canvas.width + 2*this.paddingLeft*dpr, this.canvas.height - 4*this.paddingBottom*dpr)
        this.drawFun(this.ctx,this.canvas,this.list,false)
      }, 350);
    }
   
  }
})