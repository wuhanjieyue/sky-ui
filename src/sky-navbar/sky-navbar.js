// components/sky-navbar/sky-navbar.js
const {shared} = wx.worklet
let app = getApp()
Component({

  lifetimes:{
    created(){
      this.saftPadding = shared(0)
      this.barheight = shared(0)

    },

    attached(){
        this.applyAnimatedStyle('.navview', () => {
          'worklet'
          return {paddingTop: `${this.saftPadding.value}px` }
      })
        this.applyAnimatedStyle('.barview', () => {
          'worklet'
          return {height: `${this.barheight.value}px` }
      })
      wx.nextTick(()=>{

        if(app.globalData.sky_menu.top && app.globalData.sky_menu.height){
            this.saftPadding.value = app.globalData.sky_menu.top
            this.barheight.value = app.globalData.sky_menu.height
        }else{
            ;(async ()=>{
              const SkyUtils = await import('/miniprogram_npm/jieyue-ui-com/utils/skyUtils');
              // 在函数调用时动态引入模块
              wx.SkyUtils = SkyUtils.default;
              wx.SkyUtils.skyInit()
              this.saftPadding.value = app.globalData.sky_menu.top
              this.barheight.value = app.globalData.sky_menu.height
            })()
        }

        if(this.data.autoIcon != ''){
            if(getCurrentPages().length <= 1){
                this.setData({leftIcon:'home'})
            }
        }
      })
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 顶部安全区域
    saftTop:{
      type:Boolean,
      value:true
    },
    // 自定义导航栏
    custom:{
      type:Boolean,
      value:false
    },
    // 布局 start center
    layOut:{
      type:String,
      value:"start"
    },
    // 首位图标
      leftIcon:{
        type:String,
        value:'chevron-left'
      },
      // 首位自动切换图标，当设置时，如果检测页面栈<=1时，左侧图标自动切换成设置的autoIcon
      autoIcon:{
        type:String,
        value:'',
      },
      // 次位图标
      rightIcon:{
        type:String,
        value:''
      },
      // 左边图标大小
      leftSize:{
        type:Number,
        value:38
      },
      // 右边图标大小
      rightSize:{
        type:Number,
        value:38
      },
      // 图标颜色
      iconColor:{
        type:String,
        value:'var(--text-l0)'
      },

    // 图标展示类型 normal  普通排列； capsule 胶囊类型
      iconType:{
        type:String,
        value:'normal'
      },
      // 标题
      title:{
        type:String,
        value:''
      },
      // 标题字体大小
      titleSize:{
        type:Number,
        value:32
      },
      // 标题加粗
      titleBlod:{
        type:Boolean,
        value:false
      },
      // 标题颜色
      titleColor:{
        type:String,
        value:'var(--text-l0)'
      },
      // 导航栏底部阴影
      shadow:{
        type:Boolean,
        value:false
      }

  },

  /**
   * 组件的初始数据
   */
  data: {
    sky_menu:{}
  },
  /**
   * 组件的方法列表
   */
  methods: {
      touchLeft(){
        this.triggerEvent('touchLeft', {}, {})
      },
      touchRight(){
        this.triggerEvent('touchRight', {}, {})
      },
      touchTitle(){
        this.triggerEvent('touchTitle', {}, {})
      }
  }
})
