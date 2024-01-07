// components/sky-divider/sky-divider.js
const {shared} = wx.worklet



let colorTemp = "var(--bg-l1)"
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 切割线颜色
    lineColor:{
      type:String,
      value:colorTemp
    },
    // 加载状态
    loading:{
      type:Boolean,
      value:false
    },
    // 加载状态颜色
    loadColor:{
      type:String,
      value:'var(--text-l1)'
    },
    // 切割线文字
    title:{
      type:String,
      value:''
    },
    // 切割线文字颜色
    textColor:{
      type:String,
      value:'var(--text-l1)'
    },
    // 左右隐藏耳是否显示
    breachShow:{
      type:Boolean,
      value:false
    },
    // 左右隐藏耳颜色
    lineBreachColor:{
      type:String,
      value:colorTemp
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

  }
})