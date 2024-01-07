// components/sky-layout/sky-layout.js
Component({
  options: {
    dynamicSlots: true, // 启用动态 slot
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // layout组件中的列表数据
    list:{
      type:Array,
      value:[]
    },
    // 数据for循环的"wx:key"值
    Key:{
      type:String,
      value:"index"
    },
    // 布局每行的item个数
    lineCount:{
      type:Number,
      optionalTypes:[String],
      value:3
    }
  },
  observers: {
    'list': function(list) {
      this.setData({listFlag:false})
      wx.nextTick(()=>{
        this.setData({listFlag:true})
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    listFlag:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})