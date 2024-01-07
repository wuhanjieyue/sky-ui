// components/sky-tabbar/sky-tabbar.js
import getCssColor from '../utils/colors';
import SkyUtils from '../utils/skyUtils'
const {shared,timing,sequence,runOnJS} = wx.worklet
let app = getApp()
let dpr = wx.getSystemInfoSync().pixelRatio

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    canvasId:{
      type:String,
      optionalTypes:[Number],
      value:''
    },
    // 自动显示导航栏底部安全区域
    safeBottom:{
      type:Boolean,
      value:true
    },
    // 导航栏样式  可选 norm 普通/protrude 凸出/concave 凹陷
    type:{
      type:String,
      value:"norm"
    },
    // 导航栏列表 tabbarItem :{pagePath:"",text:"消息",iconPath:"",selectedIconPath:"",iconPathDark:"",selectedIconPathDark:""}
    tabbars:{
      type:Array,
      value:[]
    },
    // 默认选中项下标
    selected:{
      type:Number,
      value:0
    },
    // 导航栏边框弧角 
    borderRadius:{
      type:Boolean,
      value:false
    },
    // tab 上的文字默认颜色,使用颜色变量可以自动适配深色模式
    color:{
      type:String,
      value:"var(--text-l2)"
    },
    // 选中项文字默认颜色,使用颜色变量可以自动适配深色模式
    selectedColor:{
      type:String,
      value:"var(--text-l0)"
    },
    // 底部导航栏背景色
    backgroundColor:{
      type:String,
      value:"var(--bg-l0)"
    },
    // 切换选中项是否有动画效果
    animation:{
      type:Boolean,
      value:false
    },
    // 切换选中项是否有震动效果
    vibration:{
      type:Boolean,
      value:false
    },
  //  底部导航栏阴影
    shadow:{
      type:Boolean,
      value:false
    }
  },
  observers:{
    'borderRadius':function(borderRadius){
      if(borderRadius){
        this.redius.value = 8
      }
    },
    'safeBottom':function(safeBottom){
      if(safeBottom ){
        this.computeBottom()
      }
    },

    // 'tabbars':function(tabbars){
    //     this.readyTabbar(tabbars)
    // },
    'selected':function(selected){
      if(this.readyFlag.value ){
        this.selectedChanged(selected)
      }
    }

  },
  pageLifetimes:{
    show:function(){
      if(this.reDraw.value ){
        if( type == 'protrude'){
          this.drawProtrude()
        }else{
          this.drawConcave()
        }
      }
      this.reDraw.value = false

    },
    hide: function() {
      // 页面被隐藏
      this.reDraw.value = true
    },
  },
  lifetimes:{
    created(){
      this.readyFlag = shared(false)

      this.oldSelected = shared(0)
      this.startLeft = shared(0)
      this.itemWidth = shared(0)

      this.redius = shared(0)
      this.safeBottom = shared(0)
      // canvas 
      // this.canvasWidth = shared(80)
      // this.canvasHeight = shared(40)
      this.canvasX = shared(0)
      // 凹陷整宽
      this.concaveWidth = shared(0)
      this.concaveHeight = shared(0)

      this.reDraw = shared(false)
      this.conWidth = shared(0)
      this.conHeight = shared(60)
      this.otherHeight = shared(60)
      this.otherWidth = shared(0)

      this.ctx = shared(null)
      this.canvas =shared(null)
      
    },
    attached(){
      this.applyAnimatedStyle('.tabbarview', () => {
        'worklet'
        return { borderRadius: `${this.redius.value}px`}
      })

      this.applyAnimatedStyle('.bottom', () => {
        'worklet'
        return { paddingBottom: `${this.safeBottom.value}px`}
      })

      this.applyAnimatedStyle('.conView', () => {
        'worklet'
        return { width: `${this.conWidth.value}px`,height: `${this.conHeight.value}px`}
      })

      this.applyAnimatedStyle('.conother', () => {
        'worklet'
        return { height: `${this.otherHeight.value}px`,width: `${this.otherWidth.value}px`,left:`${-this.otherWidth.value}px`}
      })

        this.readyTabbar(this.data.tabbars)

        if(this.data.type == 'protrude'){
          this.applyAnimatedStyle('.concave', () => {
            'worklet'
            return { transform: `translateX(${this.canvasX.value}px)`}
          })
          this.applyAnimatedStyle('.proholder', () => {
            'worklet'
            return { width: `${this.concaveWidth.value}px`,height: `${this.concaveHeight.value}px`, borderRadius: `${this.redius.value}px`}
          })
      
        }else  if(this.data.type == 'concave'){
          this.applyAnimatedStyle('.concave', () => {
            'worklet'
            return { transform: `translateX(${this.canvasX.value}px)`}
          })

          this.applyAnimatedStyle('.concaveview', () => {
            'worklet'
            return { width: `${this.concaveWidth.value}px`,height: `${this.concaveHeight.value}px`, borderRadius: `${this.redius.value}px`}
          })
        }
    
      this.readyApply(this.data.tabbars)
      this.computeItemPos(this.data.tabbars.length)

    },

  },
 
  /**
   * 组件的初始数据
   */
  data: {
    theme:getApp().globalData.sky_system.theme,
    itemWidth:0,
    itemHeight:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    canvasReady(index){
      this.canvasX.value = timing(this.itemWidth.value * index)
    },
    readyTabbar(tabbars){
      const protrude = (this.data.type == 'protrude' || this.data.type == 'concave')
        for(var i in tabbars){
          this['tab'+i] = shared(i== this.data.selected && protrude ? 1.3 : 1)
          this['tabY'+i] = shared(i== this.data.selected && protrude ? -10 : 0)
          this['tabflex' + i] = shared(i== this.data.selected  ? 1.3 : 1)
      }
    },
    readyApply(tabbars){
      for(var i in tabbars){
        this.applyAnimatedStyle('.tab'+i, () => {
          'worklet'
          return { flex:`${this['tabflex'+i].value}`}
        })
  
        this.applyAnimatedStyle('.icon'+i, () => {
          'worklet'
          return { transform:  `scale(${this['tab'+i].value}) translateY(${this['tabY'+i].value }px)`}
        })
    }

    },
    selectedChanged(selected){
      const oldSelected = this.oldSelected.value
      this.canvasReady(selected)
      // 动画
      if(this.data.animation){
        
        if(this.data.type == 'protrude' || this.data.type == 'concave'){
          this['tab'+selected].value = timing(1.3)
          this['tabY'+selected].value = timing(-10)
        }else{
          this['tab'+selected].value = sequence(timing(0.9,{duration:160}),timing(1,{duration:250}),timing(1,{duration:250}))
        }

        if(oldSelected != selected){
          this['tabflex' + selected].value = timing(1.3)

          this['tab'+oldSelected].value = timing(1)
          this['tabY'+oldSelected].value = timing(0)
          this['tabflex' + oldSelected].value = timing(1)
        }
      }
            // 震动
      if(this.data.vibration && oldSelected != selected){
        wx.vibrateShort({
          type:"light"
        })
      }
      this.oldSelected.value = selected
    },

    
    computeItemPos(length){
      this.createSelectorQuery().select('.itemview').boundingClientRect((res)=>{
        'worklet'
        this.startLeft.value = res.left
        this.itemWidth.value = res.width / (length + 0.3)
        // this.canvasWidth.value  = this.itemWidth.value * 1.3
        // this.canvasHeight.value = this.canvasWidth.value / 2
        this.concaveWidth.value = res.width
        this.concaveHeight.value = res.height
        if( this.data.type == 'protrude'){
          this.conWidth.value = res.width
          this.conHeight.value = res.height  + 24
          this.otherHeight.value = 0
          this.otherWidth.value = 0 
          this.drawConcave()
        }else if(this.data.type == 'concave'){
          this.conWidth.value = res.width
          this.conHeight.value = res.height 
          this.otherHeight.value = res.height 
          this.otherWidth.value = res.width
          this.drawConcave()
        }
        this.selectedChanged(this.data.selected)
        this.readyFlag.value = true
      }).exec()
    },
 
    computeBottom(){
      if(app.globalData.sky_system.screenHeight && app.globalData.sky_system.safeArea?.bottom){
        this.safeBottom.value = app.globalData.sky_system.screenHeight - app.globalData.sky_system.safeArea?.bottom
      }else{
        ;(async ()=>{
          wx.SkyUtils = SkyUtils;
          wx.SkyUtils.skyInit()
          this.safeBottom.value = app.globalData.sky_system.screenHeight - app.globalData.sky_system.safeArea?.bottom
        })()
      }
    },
    tapIcon(e){
      const index = e.currentTarget.dataset.index
      if(this.data.selected == index){
          return;
      }
      this.setData({selected:index})
      wx.nextTick(()=>{
        wx.switchTab({
          url: e.currentTarget.dataset.path,
          complete:(res)=>{
            res['pagePath'] = e.currentTarget.dataset.path
            res['index'] = index
            this.triggerEvent('tapIcon', res, {})
          }
        })
      })
    },
    drawConcave(){
      this.createSelectorQuery().select('#co'+this.data.canvasId)
        .fields({ node: true, size: true })
        .exec((res) => {
        
          var canvas = res[0].node
          var ctx = canvas.getContext('2d')
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr 
         
          if(this.data.type == 'concave'){
            const radius = 0
            const x = 0
            const y = 0
            const width = canvas.width
            const height = canvas.height 
            const itemWidth = width / (this.data.tabbars.length + 0.3) * 1.3 - 12
            const itemX = 6
            const itemY = height * 0.56
            ctx.beginPath();
            ctx.moveTo(itemX + radius , 0);
            ctx.bezierCurveTo(itemX + itemWidth / 4, y, itemX + itemWidth / 4 - itemWidth/10, itemY, itemX + itemWidth / 2, itemY);
            ctx.bezierCurveTo(itemX + itemWidth * 3 / 4 + itemWidth/10, itemY,itemX + itemWidth * 3 / 4, y,itemX + itemWidth, y );
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, itemX, y, radius);
            ctx.fillStyle = getCssColor(this.data.backgroundColor);
            if(this.data.shadow){
              ctx.shadowOffsetY = 0
              ctx.shadowOffsetX = 0
              ctx.shadowBlur = 8;
              ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
            }
            ctx.closePath();
            ctx.fill();
          }else if(this.data.type == 'protrude'){
            const radius = this.data.borderRadius  ? 8*dpr : 0
            const x = 0
            // 本为24 为压线+1
            const y = 25 * dpr 
            const height = canvas.height - 24 * dpr
            
      
            const itemWidth = canvas.width / (this.data.tabbars.length + 0.3) * 1.3 
            const width = canvas.width
        
            const itemY = 32
            let itemX =  0
            ctx.beginPath();
            ctx.fillStyle =  getCssColor(this.data.backgroundColor);
            if(this.data.shadow){
              ctx.shadowOffsetY = -6
              ctx.shadowOffsetX = 0
              ctx.shadowBlur = 6;
              ctx.shadowColor = 'rgba(0, 0, 0, .15)';
            }
            ctx.moveTo(itemX + 30 , y);
            ctx.bezierCurveTo(itemX + itemWidth / 4, y, itemX + itemWidth / 4, itemY, itemX + itemWidth / 2, itemY);
            // ctx.moveTo(itemX + itemWidth / 2, itemY);
            ctx.bezierCurveTo(itemX + itemWidth * 3 / 4 , itemY,itemX + itemWidth * 3 / 4, y,itemWidth - 30 , y );
            ctx.closePath();
            ctx.fill();
          }
        })
    },
    drawCon(ctx,canvas){
      
    },
    drawPro(ctx,canvas){

    }
  }
})