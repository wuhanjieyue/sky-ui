// components/sky-drawer/sky-drawer.js
const {shared,timing,runOnUI} = wx.worklet
Component({
  options: {
    dynamicSlots: true, // 启用动态 slot
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 抽屉标题
    title:{
      type:String,
      value:''
    },
    // 抽屉右边的按钮图标（参考icon）
    iconName:{
      type:String,
      value:""
    },
    // 抽屉右边的自定义按钮的图片地址url
    iconImg:{
      type:String,
      value:""
    },

    // 抽屉背景颜色
    backColor:{
      type:String,
      value:"var(--bg-l0)"
    },
    // 抽屉文字颜色
    textColor:{
      type:String,
      value:"var(--text-l0)"
    },
    // 控制抽屉是否展开
    drawFlag:{
      type:Boolean,
      value:false
    },
    // 抽屉展开与回收的动画时长
    drawDuration:{
      type:Number,
      value:250
    },
    // 点击右边按钮时会有旋转动画，此属性控制旋转角度
    drawIconRotate:{
      type:Number,
      value:0
    },
    // 点击抽屉标题栏时，是否自动展开闭合
    drawControl:{
      type:Boolean,
      value:true
    }
  },
  data:{
    pageReady:false
  },
  observers: {
    'drawFlag': function(drawFlag) {
      if(this.data.pageReady){
        this.resetHeight(drawFlag)
      }
    }
  },
  lifetimes:{
    created(){
        this.actualHeight = shared(0)
        this.itemHeight = shared(0)
        this.iconTrans = shared(0)
        this.duration = shared(250)
    },

    attached(){
      this.applyAnimatedStyle('.drawControl', () => {
        'worklet'
        return {height: `${this.itemHeight.value}px` }
      })
      this.applyAnimatedStyle('.icon', () => {
        'worklet'
        return {transform: `rotate(${this.iconTrans.value}deg)` }
      })

    },
    ready(){
      this.setData({pageReady:true})
      wx.nextTick(()=>{
          this.duration.value = this.data.drawDuration
          this.computeHeight(this.data.drawFlag)
      })
    }

  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 组件事件参数：e.detail 为展开状态
    tapIcon(){
      // "worklet"
      this.triggerEvent('tapIcon',this.itemHeight.value != 0 , {})
      if(this.data.drawControl){
         this.setData({drawFlag : ! this.data.drawFlag})
      }
    },
    setHeight(flag){
      "worklet"
      this.itemHeight.value = timing(flag ? this.actualHeight.value : 0,{duration:this.duration.value})
      
    },
    /**
     * @param {抽屉闭合判断} drawFlag 
     */
    computeHeight(drawFlag){
      this.createSelectorQuery().select('#drawItem').boundingClientRect((res)=>{
        this.actualHeight.value = res.height
        let height = 0;
        let drawIconRotate = 0
        if(drawFlag){
          height = res.height;
          drawIconRotate = this.data.drawIconRotate
        }else{
          height = 0
          drawIconRotate = 0
        }

        runOnUI(this.workletFun.bind(this))(height,drawIconRotate)
      }).exec()
    },
    resetHeight(drawFlag){
      let height = 0;
      let drawIconRotate = 0
      if(drawFlag){
        height = this.actualHeight.value;
        drawIconRotate = this.data.drawIconRotate
      }else{
        height = 0
        drawIconRotate = 0
      }
      runOnUI(this.workletFun.bind(this))(height,drawIconRotate)

    },
    workletFun(height,rotate){
      "worklet"
      this.itemHeight.value = timing(height,{duration:this.duration.value})
      this.iconTrans.value = timing(rotate,{duration:this.duration.value})
    }
  }
})