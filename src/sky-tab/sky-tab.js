// components/sky-tab/sky-tab.js
const {shared,timing,delay,runOnJS} = wx.worklet
Component({

 
  lifetimes:{
    created(){
        // 滑动时是否可以进行动画
        this.canAn = shared(false)
        this.startLeft = shared(0)
        // 选项卡状态栏
        this.tabLeft = shared(0)
        this.tabWidth = shared(0)

        // 滑动tab当前index和上一次index
        this.lineNum = shared(0)
        this.oldNum = shared(0)

        this.duration = shared(this.data.duration)
        this.selectType = shared(this.data.selectType)


    },
    attached(){
      this.applyAnimatedStyle('.lineview', () => {
        'worklet'
        return { transform: `translateX(${this.tabLeft.value}px)`,width:`${this.tabWidth.value}px` }
      })

      wx.nextTick(()=>{
        this.workletReady()
      })
      
    }
  },  
  /**
   * 组件的初始数据
   */
  data: {

  },
 /**
   * 组件的属性列表
   */
  properties: {
    // 选项卡列表,选项卡item，数据结构如下{id:各项唯一id,title:每项标题,icon*:选项图标的各种属性,logoNumber:右上角徽标（0不显示,-1则显示点）,logoColor:徽标背景色,disabled:禁用选项}
    tabList:{
      type:Array,
      value:[]
    },
    // 选项卡选中项
    tabCurrent:{
      type:Number,
      value:0
    },
    // 选项标题未选中文本色
    tabColor:{
      type:String,
      value:'var(--text-l1)'
    },
    // 选项标题选中项文本色
    selectColor:{
      type:String,
      value:'var(--text-l0)'
    },    
    // 选项标题选中项文本是否加粗
    selectBlod:{
      type:Boolean,
      value:false
    },
    // 选中项样式,可选值 'line'底部横线/'box'盒式背景
    selectType:{
      type:String,
      value:'line'
    },
    // 选中项样式颜色
    selectBg:{
      type:String,
      value:'var(--text-l1)'
    },
    // 选项卡变化过渡动画时间
    duration:{
      type:Number,
      value:50
    }
  },
  observers:{
    'tabCurrent':function(tabCurrent){
      wx.nextTick(()=>{
        this.moveLine()
      })
    },
    'selectType':function(selectType){
      this.selectType.value = selectType ? selectType : 'line'
    },
    'duration':function(duration){
      this.duration.value = duration ? duration : 50
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    workletReady(){
      this.lineNum.value = this.data.tabCurrent
      this.createSelectorQuery().select('#tabstart').boundingClientRect((res)=>{
        'worklet'
        this.startLeft.value = res.left
        this.moveLine()
      }).exec()

    },
    chooseTab(e){
      this.triggerEvent('touchTab', {index:e.currentTarget.dataset.index}, {})
      if(e.currentTarget.dataset.disabled){
        return
      }
      this.oldNum.value = this.lineNum.value
      this.lineNum.value = e.currentTarget.dataset.index
      this.setData({tabCurrent:e.currentTarget.dataset.index})
    },
  
    topscr(e){
      'worklet'
      this.tabLeft.value = this.tabLeft.value - e.detail.deltaX
      
      if(this.lineNum.value != this.oldNum.value){
        runOnJS(this.moveLine.bind(this))()
      }
    },
    endscr(e){
      this.oldNum.value = this.lineNum.value
      this.lineNum.value = this.data.tabCurrent
    },
    moveLine(){
      this.createSelectorQuery().select('.text'+this.data.tabCurrent).boundingClientRect((res)=>{
        'worklet'
        const width = res.width
        if(this.selectType.value == 'line'){
          this.tabLeft.value = timing(res.left - this.startLeft.value + width*0.2,{duration:this.duration.value})
          this.tabWidth.value = delay(this.duration.value,timing(width * 0.6,{duration:30}))
        }else{
          this.tabLeft.value = timing(res.left - this.startLeft.value - 12,{duration:this.duration.value})
          this.tabWidth.value = width + 24
        }

      }).exec()
    }
  }
})