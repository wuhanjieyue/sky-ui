// components/sky-icons/sky-icons.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 图标名称
    iconName:{
      type:String,
      value:''
    },
    // 自定义图标图片url
    iconImg:{
      type:String,
      value:''
    },
    // 图标大小
    iconSize:{
      type:Number,
      value:36
    },
    // 图标颜色
    iconColor:{
      type:String,
      value:'var(--text-l0)'
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